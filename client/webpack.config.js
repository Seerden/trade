/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const miniCss = require("mini-css-extract-plugin");
const DefinePlugin = require("webpack").DefinePlugin;
const config = require("dotenv").config;
config({
	path: "./.env",
});

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
	watchOptions: {
		poll: 1000,
	},
	devServer: {
		host: "0.0.0.0",
		allowedHosts: "all",
		port: 3000,
		historyApiFallback: true,
		proxy: {
			"/api": {
				target: "http://[::1]:5000",
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
			style: path.resolve(__dirname, "src", "style/"),
		},
	},
	plugins: [
		new miniCss(),
		new DefinePlugin({
			"process.env": JSON.stringify(process.env),
		}),
	],
};
