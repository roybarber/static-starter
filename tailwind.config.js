module.exports = {
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/typography')({
			className: 'wysiwyg'
		}),
		require('@tailwindcss/forms')
	]
}
