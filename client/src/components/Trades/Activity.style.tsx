import styled from "styled-components";

export const StyledCard = styled.div`
	display: inline-flex;
	justify-content: center;
	align-items: center;

	min-width: 200px;
	width: 200px;

	min-height: 100px;
	height: 100px;
	border: 1px solid blue;
`;

export const StyledRow = styled.div`
	display: flex;
	flex-direction: row;
	border: 1px solid red;

	overflow-x: scroll;
`;
