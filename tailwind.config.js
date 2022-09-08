/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./projects/mm-app/src/**/*.{html,ts}",
        "./projects/mm-lib/src/lib/**/*.{html,ts}",
    ],
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
        extend: {
            fontFamily: {
                'jost': ['"Jost"', 'sans-serif'],
            },
            letterSpacing: {
                widest: '1em',
                wider: '.6em'
            }
        },
    },
    plugins: [],
}
