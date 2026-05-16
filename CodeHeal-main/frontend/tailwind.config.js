/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-card': '#12121a',
        'border-color': '#1e1e2e',
        'accent-blue': '#00d4ff',
        'accent-green': '#00ff88',
        'accent-red': '#ff4455',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
