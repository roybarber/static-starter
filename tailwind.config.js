module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.html', './src/assets/js/**/*.js'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
      	require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/line-clamp')
	]
}
