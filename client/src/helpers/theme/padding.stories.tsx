import { ComponentMeta, ComponentStory } from "@storybook/react";
import styled, { css } from "styled-components";
import { theme } from "./theme";

type Padding = keyof typeof theme.padding;
type WidePadding = keyof typeof theme.padding.wide;

const StyledSpan = styled.span`
	display: flex;
	width: 11rem;
	height: 1.5rem;
	align-items: center;
	background-color: #dfdfdf;
`;

const StyledDiv = styled.div<{ size: Padding | WidePadding; wide?: boolean }>`
	border: 2px solid black;
	display: flex;
	width: max-content;

	background-color: orangered;

	${(p) =>
		!p.wide
			? css`
					padding: ${p.theme.padding[p.size]};
			  `
			: css`
					padding: ${p.theme.padding.wide[p.size]};
			  `}
`;

function Div({
	padding: paddingSize,
	children,
}: {
	padding?: Padding;
	widePadding?: WidePadding;
	children: React.ReactNode;
}) {
	return <StyledDiv size={paddingSize}>{children}</StyledDiv>;
}

export default {
	component: Div,
	argTypes: {},
} as ComponentMeta<typeof Div>;

export const SymmetricPadding: ComponentStory<typeof Div> = ({ padding }) => (
	<Div padding={padding}>
		<StyledSpan>Padding: {padding}</StyledSpan>
	</Div>
);
SymmetricPadding.argTypes = {
	padding: {
		options: ["large", "medium", "small", "tiny", "tiniest"],
		control: { type: "radio" },
		defaultValue: "large",
	},
};

export const WidePadding: ComponentStory<typeof StyledDiv> = ({
	widePadding,
}) => (
	<StyledDiv wide size={widePadding}>
		<StyledSpan>Padding: wide {widePadding}</StyledSpan>
	</StyledDiv>
);
WidePadding.argTypes = {
	widePadding: {
		options: "medium small tiny".split(" "),
		control: { type: "radio" },
		defaultValue: "medium",
	},
};
