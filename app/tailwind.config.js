module.exports = {
	content: [
		"./public/scripts/*.js",
		"./resources/**/*.blade.php",
		"./resources/css/app.css",
	],
	theme: {
		extend: {
			colors: {
				primary: "hsl(15, 18%, 47%)",
				secondary: "hsl(340, 82%, 76%)",
			},
			fontFamily: {
				sans: ["Open Sans", "sans-serif"],
			},
		},
	},
};
