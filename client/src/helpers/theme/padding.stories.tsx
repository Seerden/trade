import { ComponentMeta, ComponentStory } from "@storybook/react";
import styled from "styled-components";
import { theme } from "./theme";

type Padding = keyof typeof theme.padding;

const StyledDiv = styled.div<{ size: Padding }>`
	border: 2px solid black;
	display: flex;
	width: max-content;

	padding: ${(p) => p.theme.padding[p.size]};
`;

function Div({
	paddingSize,
	children,
}: {
	paddingSize: Padding;
	children: React.ReactNode;
}) {
	return <StyledDiv size={paddingSize}>{children}</StyledDiv>;
}

export default {
	component: Div,
	argTypes: {
		paddingSize: {
			options: ["large", "medium", "small", "tiny", "tiniest"],
			control: { type: "radio" },
			defaultValue: "large",
		},
	},
} as ComponentMeta<typeof Div>;

export const Playground: ComponentStory<typeof Div> = ({ paddingSize }) => (
	<Div paddingSize={paddingSize}>Padding: {paddingSize}</Div>
);
