import { SharedBaseInput } from "style/shared/input.style";
import styled, { css } from "styled-components";
import { TradeAction } from "types/tickets";

const defaultInputWidth = "6.5rem";
const smallInputWidth = "5rem";
const largeInputWidth = "9rem";
const inputHeight = "2rem";

export const StyledInput = styled(SharedBaseInput)<{ $size?: string }>`
	height: ${inputHeight};

	// This default width is currently only used for the name="time" input
	// component, it needs slightly more width in locales where AM/PM are
	// specified instead of using 24-hour times.
	min-width: ${defaultInputWidth};
	width: ${defaultInputWidth};

	${(p) =>
		p.$size === "small" &&
		css`
			min-width: ${smallInputWidth};
			width: ${smallInputWidth};
		`}

	${(p) =>
		p.$size === "large" &&
		css`
			min-width: ${largeInputWidth};
			width: ${largeInputWidth};
		`}

	&::placeholder {
		font-size: ${({ theme }) => theme.font.smaller};
	}

	&:required {
		&:placeholder-shown {
			border-bottom: 2px solid orange;
		}
	}

	transition: border 100ms ease-out;
`;

const actionToColor = {
	buy: "seagreen",
	sell: "orange",
};

export const StyledTradeActionButton = styled.span`
	width: max-content;
	position: relative;
`;

export const StyledTradeActionInput = styled.input`
	display: inline-block;
	position: absolute;
	z-index: 0;
	left: calc(100% - 2rem);
	opacity: 0;
	width: 100%;
	height: 100%;
`;

export const StyledTradeActionLabel = styled.label<{
	action: TradeAction;
	active?: boolean;
	required?: boolean;
}>`
	display: inline-block;

	// smallInputWidth is 5rem. The TradeActionButtons 'field' contains 'buy'
	// and 'sell' buttons, so the proper width for each button is
	// smallInputWidth/2.
	width: calc(${smallInputWidth} / 2);
	padding: ${(p) => p.theme.padding.wide.medium};
	font-size: ${(p) => p.theme.font.medium};

	border: 2px solid transparent;
	border-color: ${(p) => p.active && actionToColor[p.action]};

	background-color: transparent;

	color: ${(p) => actionToColor[p.action]};

	transition: all 35ms fade-out;

	height: ${inputHeight};
	display: inline-flex;
	justify-content: center;
	align-items: center;

	${(p) =>
		p.required &&
		css`
			border-bottom: 2px solid orange;
		`}
`;

export const StyledNewTicketHeader = styled.div`
	display: grid;

	// These column widths and gap size have to match the StyledInput widths in
	// the NewTicket component.
	grid-template-columns: repeat(4, ${smallInputWidth}) ${largeInputWidth} ${defaultInputWidth};
	gap: ${({ theme }) => theme.padding.tiny};

	label {
		user-select: none;
		text-align: center;
		font-size: ${({ theme }) => theme.font.smaller};
		font-weight: 500;
		border-bottom: 2px solid #eee;
		padding-bottom: ${(p) => p.theme.padding.tinier};
		margin-bottom: ${(p) => p.theme.padding.tinier};
	}
`;
