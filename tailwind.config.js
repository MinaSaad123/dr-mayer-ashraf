/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./public/**/*.html', './public/assets/js/app.js'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Cairo', 'Plus Jakarta Sans', 'sans-serif'],
                en: ['Plus Jakarta Sans', 'sans-serif'],
            },
            colors: {
                physio: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                navy: {
                    800: '#1e293b',
                    900: '#0f172a',
                },
            },
        },
    },
    plugins: [],
};
