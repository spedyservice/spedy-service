/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f0f0f',
        secondary: '#1a1a1a',
        // Accent color (used in buttons and links)
        'accent': '#f97316',  // Orange color
        'accent-dark': '#ea580c',
        'accent-light': '#fb923c',
        // Blue colors
        'light-blue': '#38bdf8',
        'light-blue-dark': '#0ea5e9',
        'light-blue-light': '#7dd3fc',
        'blue-600': '#2563eb',
        'blue-700': '#1d4ed8',
        // Orange colors (for buttons)
        'orange': '#f97316',
        'orange-500': '#f97316',
        'orange-600': '#ea580c',
        'orange-400': '#fb923c',
        // Yellow colors
        'yellow': '#fbbf24',
        'yellow-dark': '#f59e0b',
        'yellow-light': '#fcd34d',
        // Neutral colors
        'white': '#ffffff',
        'gray-light': '#f3f4f6',
        'gray-medium': '#9ca3af',
        'gray-dark': '#4b5563',
        // Navy colors
        'navy': '#0a192f',
        'navy-dark': '#051021',
        'navy-light': '#112240',
        'navy-800': '#0a2540',
        'navy-900': '#061a30',
        'dark-blue': '#0a2b4e',
        'deep-blue': '#1a365d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'navbar': '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}