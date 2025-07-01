/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-inter)", "sans-serif"],
				futura: ["'Futura'", "sans-serif"],
			},
			animation: {
				gradient: "gradientBG 0.5s ease infinite",
				"spin-slower": "spin 20s linear infinite",
			},
			keyframes: {
				gradientBG: {
					"0%, 100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" },
				},
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
	plugins: [require("@tailwindcss/typography")],
};
