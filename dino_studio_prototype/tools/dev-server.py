#!/usr/bin/env python3
"""Static file server for the prototype, with caching disabled.

`python3 -m http.server` lets the browser cache JS/CSS, which during
development means you can end up testing a stale page against fresh files —
easy to misread as a code bug. This serves the same files but tells the
browser never to reuse them.

Usage: python3 tools/dev-server.py [port]   (run from dino_studio_prototype/)
"""

import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, *args):  # keep the console quiet
        pass


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    with ThreadingHTTPServer(("127.0.0.1", port), NoCacheHandler) as httpd:
        print(f"serving {port} with caching disabled")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
