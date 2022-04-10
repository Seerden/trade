import styled from "styled-components";

/** TODO:
 * WIP component. This will be a shared component, everything in here will be a
 * theme value.
 */
export const StyledContainer = styled.section`
	position: fixed;
	z-index: 21;

	margin-top: 20vh;
	left: 50%;
	transform: translateX(-50%);
	padding: 2rem;
	border: 4px solid #444;
	box-shadow: 0 0 1rem #111;
	border-radius: 5px;
	background: #efefef;
	width: max-content;
`;

// This is the background that serves to add visual focus to the modal.
export const StyledOverlay = styled.div`
	position: fixed;
	z-index: 20;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.68);
`;

// TODO: all of this styling is WIP and should at least be refactored to theme values
export const StyledModalCloseButton = styled.button`
	display: inline-flex;
	position: absolute;
	top: -10px;
	right: -10px;

	width: 20px;
	height: 20px;
	background-color: orangered;

	border-radius: 50%;

	line-height: 20px;
	justify-content: center;
	align-items: center;
	text-align: center;
`;
