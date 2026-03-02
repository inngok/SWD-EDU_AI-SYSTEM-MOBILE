/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0487e2',
                    dark: '#0463ca',
                    light: '#e0f2fe',
                    border: '#b0d6f5',
                }
            }
        },
    },
    plugins: [],
}
