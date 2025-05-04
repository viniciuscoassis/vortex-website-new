// Theme configuration with standardized colors
export const theme = {
  colors: {
    primary: {
      DEFAULT: "#10b981", // emerald-500
      light: "#34d399", // emerald-400
      dark: "#059669", // emerald-600
    },
    secondary: {
      DEFAULT: "#0ea5e9", // cyan-500
      light: "#22d3ee", // cyan-400
      dark: "#0284c7", // cyan-600
    },
    background: {
      DEFAULT: "#000000",
      card: "rgba(0, 0, 0, 0.4)",
      overlay: "rgba(0, 0, 0, 0.8)",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a1a1aa", // zinc-400
      muted: "#71717a", // zinc-500
      accent: "#10b981", // emerald-500
    },
    border: {
      DEFAULT: "#27272a", // zinc-800
      light: "#3f3f46", // zinc-700
      accent: "rgba(16, 185, 129, 0.3)", // emerald-500 with opacity
    },
  },
  gradients: {
    primary: "linear-gradient(to right, #10b981, #0ea5e9)", // emerald to cyan
    glow: "linear-gradient(to right, rgba(16, 185, 129, 0.2), rgba(14, 165, 233, 0.2))",
    card: "linear-gradient(to bottom right, rgba(16, 185, 129, 0.1), rgba(0, 0, 0, 0))",
  },
}

// Usage example:
// className={`text-[${theme.colors.text.accent}]`}
// or with Tailwind: className="text-emerald-500"
