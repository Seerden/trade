/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const miniCss = require("mini-css-extract-plugin");

// 1. import default from the plugin module
const createStyledComponentsTransformer =
    require("typescript-plugin-styled-components").default;

// 2. create a transformer;
// the factory additionally accepts an options object which described below
const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = {
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/",
    },
    devServer: {
        port: 3000,
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: "http://localhost:5000",
                pathRewrite: {
                    "^/api": "",
                },
                changeOrigin: true,
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                options: {
                    getCustomTransformers: () => ({
                        before: [styledComponentsTransformer],
                    }),
                },
            },
            {
                test: /\.scss$/,
                use: [miniCss.loader, "css-loader", "sass-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".js", ".js", ".ts"],
        alias: {
            components: path.resolve(__dirname, "src", "components/"),
            hooks: path.resolve(__dirname, "src", "hooks/"),
            helpers: path.resolve(__dirname, "src", "helpers/"),
            state: path.resolve(__dirname, "src", "state/"),
            types: path.resolve(__dirname, "src", "types/"),
        },
    },
    plugins: [new miniCss()],
};
