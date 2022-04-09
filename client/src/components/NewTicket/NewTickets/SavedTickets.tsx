/**
 * Component that displays information on just-saved trade tickets.
 *
 * The easiest and probably also (UI-wise) logical implementation is a modal of
 * some kind.
 */

import styled from "styled-components";
import { PreviewRow } from "./TicketsPreview";

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

/** TODO: WIP component. This will be a shared component. */
const StyledContainer = styled.section`
	margin: 0 auto;
	margin-top: 25%;
	padding: 2rem;
	border: 4px solid #444;
	box-shadow: 0 0 1rem #111;
	border-radius: 5px;
	background: #efefef;
	width: max-content;

	position: relative;
	z-index: 10;
`;

const StyledSavedTickets = styled.ul`
	width: max-content;
`;
