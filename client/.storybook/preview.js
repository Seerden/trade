// see https://stackoverflow.com/a/64523081/12820947
import "!style-loader!css-loader!sass-loader!../src/index.scss";
import { addDecorator } from "@storybook/react";
import { withThemesProvider } from "storybook-addon-styled-component-theme";
import { ThemeProvider } from "styled-components";
import { theme } from "../src/helpers/theme/theme";

const themes = [theme];
addDecorator(withThemesProvider(themes), ThemeProvider);

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};
