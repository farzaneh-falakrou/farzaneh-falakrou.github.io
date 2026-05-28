tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: "#080B2D",
        muted: "#5A6285",
        shell: "#F5F7FB",
        line: "#E1E6F0",
        violet: "#5A2DF0",
        coral: "#D6394A",
        mint: "#0E7A55",
        mintLight: "#7EEAB8",
        amber: "#B96D00",
        ocean: "#2C80F6",
        cyan: "#22D3EE",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10, 14, 45, 0.04), 0 12px 32px -8px rgba(10, 14, 45, 0.10)",
        softHover: "0 2px 4px rgba(10, 14, 45, 0.05), 0 22px 50px -10px rgba(90, 45, 240, 0.18)",
        lift: "0 8px 20px -6px rgba(90, 45, 240, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
        liftHover: "0 12px 28px -6px rgba(90, 45, 240, 0.7)",
        glow: "0 8px 24px -6px rgba(90, 45, 240, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
};
