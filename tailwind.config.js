/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{js,jsx}',
	],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: '#0f536c',
					light: '#136c8c',
					dark: '#0a3a4c',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			fontFamily: {
				sans: ['"DM Sans"', 'sans-serif'],
			},
		},
	},
	plugins: [],
};
