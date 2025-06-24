/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-inter)", "sans-serif"],
			},
			colors: {
				primary: "#546a76",
				secondary: "#88a0a8",
				soft: "#b4ceb3",
				light: "#dbd3c9",
				accent: "#fad4d8",
			},
		},
	},
	plugins: [],
};
