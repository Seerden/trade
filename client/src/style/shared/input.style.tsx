import styled from "styled-components";

/**
 * Shared input component.
 *
 * Comes with a few basic styles.
 *
 * I expect we'll end up with a few types of inputs throughout the application,
 * and that, as long as we share theme values, we'll achieve visual cohesion
 * relatively well.
 */
export const SharedBaseInput = styled.input`
	font-size: ${(p) => p.theme.font.small};
	padding: ${(p) => p.theme.padding.tiniest};
	text-indent: ${(p) => p.theme.padding.tiny};

	border: 1px solid ${(p) => p.theme.colors.text.secondary};
	outline: none;

	&:focus,
	&:hover {
		outline: 1px solid ${(p) => p.theme.colors.text.secondary};
	}
`;
