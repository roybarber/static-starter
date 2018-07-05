module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		jquery: true
	},
	extends: 'eslint:recommended',
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'no-console': 0
	}
};
