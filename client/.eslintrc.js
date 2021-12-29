module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["react", "@typescript-eslint"],
	settings: {
		react: {
			version: "detect",
		},
		"import/resolver": {
			alias: {
				map: [
					["components", "src/components"],
					["hooks", "src/hooks"],
				],
			},
		},
	},
	rules: {
		"max-len": 0,
		"react/react-in-jsx-scope": "off",
		"react/jsx-first-prop-new-line": [1, "multiline"],
		"react/jsx-max-props-per-line": "off",
		// "react/jsx-indent-props": [2, 2],
		"react/jsx-closing-bracket-location": [2, "tag-aligned"],
		"react/prop-types": "off",
		"react/display-name": "off",
		"no-mixed-spaces-and-tabs": "off",
		"react/no-unescaped-entities": "off",
	},
	overrides: [
		{
			files: ["**/*.js?(x)", "**/*.ts?(x)"],
			rules: {
				"react-hooks/exhaustive-deps": "off",
				"@typescript-eslint/no-unused-vars": "off",
				"@typescript-eslint/explicit-module-boundary-types": "off",
				"no-unused-vars": "off",
			},
		},
	],
};
