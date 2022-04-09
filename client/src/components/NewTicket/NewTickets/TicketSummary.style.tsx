import styled from "styled-components";

/** TODO:
 * WIP component. This will be a shared component, everything in here will be a
 * theme value.
 */
export const StyledContainer = styled.section`
	position: relative;
	z-index: 10;

	margin: 0 auto;
	margin-top: 25%;
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
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.68);
`;
