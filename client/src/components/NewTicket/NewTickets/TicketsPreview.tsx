import styled from "styled-components";
import { NewTicket } from "types/ticket.types";
import { makeTicketString } from "./helpers/ticket-string";
import { SavedTicket } from "./SavedTickets";

const headerText = "The following tickets will be saved if you click 'submit':";

const StyledHeader = styled.h1`
	// This should be a theme value. In fact, this whole StyledHeader should be a
	// shared Styled component
	font-size: 2rem;
`;

type Props = {
	tickets: NewTicket[];
};

export default function TicketsPreview({ tickets }: Props) {
	// takes a list of to-be-submitted tickets and displays (in a modal or
	// something) the contents of the ticket.

	/**
	 * @todo create a modal
	 */

	if (!tickets?.length) {
		return <></>;
	}

	return (
		<>
			<StyledHeader>{headerText}</StyledHeader>
			<ul>
				{tickets.map((ticket) => (
					<PreviewRow ticket={ticket} key={ticket.timestamp} />
				))}
			</ul>
		</>
	);
}

const StyledRow = styled.li`
	font-weight: 400;
	font-size: 0.72rem;
`;

export function PreviewRow({ ticket }: { ticket: NewTicket | SavedTicket }) {
	const ticketString = makeTicketString(ticket);

	return <StyledRow>{ticketString}</StyledRow>;
}
