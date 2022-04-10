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
	font-size: var(--text-medium);
	padding: var(--pad-small);
	text-indent: calc(2 * var(--pad-small));

	border: 1px solid var(--secondary);
	outline: none;

	&:focus,
	&:hover {
		outline: 1px solid var(--secondary);
	}
`;
