import dayjs from "dayjs";
import styled from "styled-components";
import { NewTicket } from "types/ticket.types";
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
	const { ticker, quantity, timestamp, action, price } = ticket;

	const dateString = dayjs(+timestamp).format("MMMM D, YYYY");
	const timeString = dayjs(+timestamp).format("HH:mm");

	// TODO: if quantity === 1, use 'share' instead of 'shares'
	// TODO: use date string like 'April 5, 2022', not "05 Apr 2022"
	const previewString = `${action} ${+quantity} shares of ${ticker} for ${+price} at ${timeString} on ${dateString}`;

	return <StyledRow>{previewString}</StyledRow>;
}
