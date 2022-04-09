/**
 * Component that displays information on just-saved trade tickets.
 *
 * The easiest and probably also (UI-wise) logical implementation is a modal of
 * some kind.
 */

import styled from "styled-components";
import { PreviewRow } from "./TicketsPreview";
import { StyledContainer, StyledOverlay } from "./TicketSummary.style";

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
			<StyledOverlay />

			{/* actual content here */}
			<StyledContainer>
				<StyledSavedTickets>{ticketStrings}</StyledSavedTickets>
			</StyledContainer>
		</>
	);
}

const StyledSavedTickets = styled.ul`
	width: max-content;
`;
