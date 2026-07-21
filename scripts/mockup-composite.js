// Composites a flat screenshot onto a device-mockup photo using a 4-point
// perspective (homography) warp, so the screenshot follows the screen's
// real tilt instead of an approximated CSS transform.
//
// Usage:
//   node scripts/mockup-composite.js <base.jpg|png> <screenshot.png> <out.png> \
//     <tlX> <tlY> <trX> <trY> <brX> <brY> <blX> <blY>
//
// The 8 numbers are the pixel coordinates of the screen's four corners in the
// BASE image (top-left, top-right, bottom-right, bottom-left), clockwise.

const fs = require('fs');
const { PNG } = require('pngjs');
const jpeg = require('jpeg-js');

function loadImage(path) {
  const buf = fs.readFileSync(path);
  if (path.toLowerCase().endsWith('.png')) {
    const png = PNG.sync.read(buf);
    return { width: png.width, height: png.height, data: png.data };
  }
  const img = jpeg.decode(buf, { useTArray: true });
  return { width: img.width, height: img.height, data: img.data };
}

// Solve the 3x3 homography mapping unit square (0,0)-(1,0)-(1,1)-(0,1)
// to the four destination points.
function computeHomography(dst) {
  const [x0, y0, x1, y1, x2, y2, x3, y3] = dst;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const denom = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / denom;
  const h = (dx1 * dy3 - dx3 * dy1) / denom;
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + h * x3;
  const c = x0;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + h * y3;
  const f = y0;
  return [a, b, c, g, d, e, f, h];
}

function bilinear(img, x, y) {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, img.width - 1);
  const y1 = Math.min(y0 + 1, img.height - 1);
  const fx = x - x0, fy = y - y0;
  const idx = (xx, yy) => (yy * img.width + xx) * 4;
  const out = [0, 0, 0, 0];
  for (let c = 0; c < 4; c++) {
    const p00 = img.data[idx(x0, y0) + c] ?? 255;
    const p10 = img.data[idx(x1, y0) + c] ?? 255;
    const p01 = img.data[idx(x0, y1) + c] ?? 255;
    const p11 = img.data[idx(x1, y1) + c] ?? 255;
    out[c] = p00 * (1 - fx) * (1 - fy) + p10 * fx * (1 - fy) + p01 * (1 - fx) * fy + p11 * fx * fy;
  }
  return out;
}

function main() {
  const [, , basePath, shotPath, outPath, ...coords] = process.argv;
  if (coords.length !== 8) {
    console.error('Need exactly 8 coordinates: tlX tlY trX trY brX brY blX blY');
    process.exit(1);
  }
  const nums = coords.map(Number);
  const base = loadImage(basePath);
  const shot = loadImage(shotPath);

  // Normalize base to RGBA if it came from JPEG (jpeg-js already gives RGBA).
  const out = new PNG({ width: base.width, height: base.height });
  base.data.copy ? base.data.copy(out.data) : out.data.set(base.data);

  const [a, b, c, g, d, e, f, h] = computeHomography(nums);

  const xs = [nums[0], nums[2], nums[4], nums[6]];
  const ys = [nums[1], nums[3], nums[5], nums[7]];
  const minX = Math.max(0, Math.floor(Math.min(...xs)));
  const maxX = Math.min(base.width - 1, Math.ceil(Math.max(...xs)));
  const minY = Math.max(0, Math.floor(Math.min(...ys)));
  const maxY = Math.min(base.height - 1, Math.ceil(Math.max(...ys)));

  // For each destination pixel, invert the homography (solve for u,v in [0,1])
  // via Newton iteration is overkill — instead we forward-map by sampling the
  // source screenshot on a fine grid and splatting, OR solve the inverse
  // homography analytically. Easiest robust approach: build the inverse
  // homography by swapping which square is unit vs destination using the
  // same solver, mapping FROM destination quad TO unit square.
  function isInsideQuad(px, py) {
    // Point-in-polygon (quad) test, clockwise points.
    const pts = [[nums[0], nums[1]], [nums[2], nums[3]], [nums[4], nums[5]], [nums[6], nums[7]]];
    let inside = true;
    for (let i = 0; i < 4; i++) {
      const [x1_, y1_] = pts[i];
      const [x2_, y2_] = pts[(i + 1) % 4];
      const cross = (x2_ - x1_) * (py - y1_) - (y2_ - y1_) * (px - x1_);
      if (cross < 0) inside = false;
    }
    return inside;
  }

  // Inverse homography: map destination point -> unit square (u,v).
  // Using the standard closed form for a general quad-to-unit-square mapping.
  function invertMap(px, py) {
    // Solve the same forward equations for u,v given x,y using iterative
    // Newton-Raphson (converges in a few steps for well-behaved quads).
    let u = 0.5, v = 0.5;
    for (let iter = 0; iter < 20; iter++) {
      const denomU = (1 + g * u);
      const denomV = (1 + h * v);
      // Forward map (matches computeHomography's convention):
      const X = (a * u + b * v + c) / (1 + g * u + h * v);
      const Y = (d * u + e * v + f) / (1 + g * u + h * v);
      const fx0 = X - px;
      const fy0 = Y - py;
      if (Math.abs(fx0) < 1e-4 && Math.abs(fy0) < 1e-4) break;
      const denom = (1 + g * u + h * v);
      // Partial derivatives
      const dXdu = (a * denom - (a * u + b * v + c) * g) / (denom * denom);
      const dXdv = (b * denom - (a * u + b * v + c) * h) / (denom * denom);
      const dYdu = (d * denom - (d * u + e * v + f) * g) / (denom * denom);
      const dYdv = (e * denom - (d * u + e * v + f) * h) / (denom * denom);
      const det = dXdu * dYdv - dXdv * dYdu;
      if (Math.abs(det) < 1e-9) break;
      const du = (fx0 * dYdv - fy0 * dXdv) / det;
      const dv = (fy0 * dXdu - fx0 * dYdu) / det;
      u -= du;
      v -= dv;
    }
    return [u, v];
  }

  for (let py = minY; py <= maxY; py++) {
    for (let px = minX; px <= maxX; px++) {
      if (!isInsideQuad(px, py)) continue;
      const [u, v] = invertMap(px, py);
      if (u < 0 || u > 1 || v < 0 || v > 1) continue;
      const sx = u * (shot.width - 1);
      const sy = v * (shot.height - 1);
      const [r, gg, bb, aa] = bilinear(shot, sx, sy);
      const di = (py * base.width + px) * 4;
      const alpha = (aa ?? 255) / 255;
      out.data[di] = r * alpha + out.data[di] * (1 - alpha);
      out.data[di + 1] = gg * alpha + out.data[di + 1] * (1 - alpha);
      out.data[di + 2] = bb * alpha + out.data[di + 2] * (1 - alpha);
      out.data[di + 3] = 255;
    }
  }

  fs.writeFileSync(outPath, PNG.sync.write(out));
  console.log('Wrote', outPath);
}

main();
