/**
 * Component that displays information on just-saved trade tickets.
 *
 * The easiest and probably also (UI-wise) logical implementation is a modal of
 * some kind.
 */

import styled from "styled-components";
import { PreviewRow } from "./TicketsPreview";
import { StyledContainer } from "./TicketSummary.style";

export type SavedTicket = {
	user_id: number;
	trade_id: number;
	ticket_id: number;
	ticker: string;
	timestamp: string;
	// TODO: this is a type like TradeAction, somewhere
	action: "buy" | "sell";
	quantity: string;
	price: string;
};

export default function SavedTickets({ tickets }: { tickets: SavedTicket[] }) {
	const ticketStrings = tickets.map((ticket, index) => (
		<PreviewRow key={index} ticket={ticket} />
	));

	return (
		<>
			{/* `position: absolute` overlay here */}
			<Overlay />

			{/* actual content here */}
			<Container>
				<StyledSavedTickets>{ticketStrings}</StyledSavedTickets>
			</Container>
		</>
	);
}

function Overlay() {
	return <StyledOverlay />;
}

const StyledOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.68);
`;

function Container({ children }) {
	return <StyledContainer>{children}</StyledContainer>;
}

const StyledSavedTickets = styled.ul`
	width: max-content;
`;
