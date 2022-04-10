import { css } from "styled-components";

export const StyledSection = css`
	border: ${(p) => p.theme.size.tiny} solid
		${(p) => p.theme.colors.grey.regular};
	padding: ${(p) => p.theme.padding.medium} ${(p) => p.theme.padding.large};
`;
