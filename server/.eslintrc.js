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
    extends: ["airbnb-base", "prettier"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 13,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {
        "no-console": "off",
        "no-restricted-syntax": 0,
        "implicit-arrow-linebreak": "off",
        "function-paren-newline": "off",
        "import/prefer-default-export": "off",
        "comma-dangle": 0,
        quotes: ["error", "double"],
        indent: ["error", 4],
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
