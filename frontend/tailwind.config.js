/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        bullish: {
          light: "#059669",
          DEFAULT: "#00E599",
          muted: "rgba(0, 229, 153, 0.12)",
          border: "rgba(0, 229, 153, 0.25)",
        },
        bearish: {
          light: "#DC2626",
          DEFAULT: "#FF385C",
          muted: "rgba(255, 56, 92, 0.12)",
          border: "rgba(255, 56, 92, 0.25)",
        },
        cyanAccent: {
          light: "#0284C7",
          DEFAULT: "#00D2FF",
          muted: "rgba(0, 210, 255, 0.12)",
          border: "rgba(0, 210, 255, 0.25)",
        },
        violetAccent: {
          light: "#7C3AED",
          DEFAULT: "#8B5CF6",
          muted: "rgba(139, 92, 246, 0.12)",
          border: "rgba(139, 92, 246, 0.25)",
        },
        amberAccent: {
          light: "#D97706",
          DEFAULT: "#FFB020",
          muted: "rgba(255, 176, 32, 0.12)",
          border: "rgba(255, 176, 32, 0.25)",
        },
        terminal: {
          bg: "#080C14",
          panel: "#0B101D",
          card: "#0F1626",
          cardHover: "#151F35",
          border: "rgba(255, 255, 255, 0.08)",
          subtle: "rgba(255, 255, 255, 0.04)",
        },
        lightAmbient: {
          bg: "#F0F4FA",
          card: "#FFFFFF",
          cardHover: "#F8FAFC",
          panel: "#F1F5F9",
          border: "#E2E8F0",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glowEmerald: "0 0 25px -5px rgba(0, 229, 153, 0.25)",
        glowRose: "0 0 25px -5px rgba(255, 56, 92, 0.25)",
        glowCyan: "0 0 25px -5px rgba(0, 210, 255, 0.25)",
        glowViolet: "0 0 25px -5px rgba(139, 92, 246, 0.25)",
        terminal: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
        cardLight: "0 4px 20px -2px rgba(15, 23, 42, 0.05)",
      },
    },
  },
  plugins: [],
}
