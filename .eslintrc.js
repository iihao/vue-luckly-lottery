module.exports = {
	env: {
		browser: true,
		es2021: true,
		node:true
	},
	extends: ['eslint:recommended', 'plugin:vue/recommended','plugin:vue/vue3-essential',],
	overrides: [],
	parserOptions: {
		ecmaVersion: 2015,
		sourceType: 'module',
		allowImportExportEverywhere: true,
		'parser': '@babel/eslint-parser',
		ecmaFeature:{jsx:false}
	},
	plugins: ['vue'],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		
		quotes: ['error', 'single'],
		semi: ['error', 'never'],
		'no-unused-vars': 'off'
	}, 
   

}
