module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	settings: {
		"import/extensions": [".js", ".mjs", ".jsx", ".ts", ".tsx"],
		"import/resolver": {
			node: {
				extensions: [".js", ".jsx", ".ts", ".tsx"],
			},
		},
	},
	extends: [
		"airbnb-base",
		"prettier",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 13,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"no-console": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"consistent-return": "off",
		"no-return-await": "off",
		"no-param-reassign": 0,
		"no-restricted-syntax": 0,
		"implicit-arrow-linebreak": "off",
		"function-paren-newline": "off",
		"import/prefer-default-export": "off",
		"no-await-in-loop": "off",
		"comma-dangle": 0,
		quotes: ["error", "double", "avoid-escape"],
		"linebreak-style": 0,
		"import/extensions": [
			"error",
			"ignorePackages",
			{
				js: "never",
				jsx: "never",
				ts: "never",
				tsx: "never",
			},
		],
	},
};
