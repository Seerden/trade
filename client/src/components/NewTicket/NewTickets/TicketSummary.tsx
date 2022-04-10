/**
 * This component encompasses two steps of the NewTicket(s) creation process:
 * - user clicks "preview tickets" => preview all tickets so the user can verify
 *   their input.
 * - if in preview screen and user clicks "save tickets", make POST request and,
 *   based on response, highlight the tickets from preview screen that were
 *   saved to the database successfully
 */

import { BsX } from "react-icons/bs";
import styled from "styled-components";
import type { NewTicket } from "types/ticket.types";
import { makeTicketString } from "./helpers/ticket-string";
import {
	StyledContainer,
	StyledModalCloseButton,
	StyledOverlay,
	StyledSubmitButton,
} from "./TicketSummary.style";
import type { SavedTicket } from "./useNewTickets";

type Props = {
	tickets: NewTicket[];
	onClose: () => void;
	savedTickets: SavedTicket[];
};

const StyledTicketSummary = styled.ul`
	width: max-content;
`;

function TicketRow({ ticket }: { ticket: NewTicket | SavedTicket }) {
	const ticketString = makeTicketString(ticket);

	// TODO: will become a StyledTicketRow, because we probably want some styling
	return <li>{ticketString}</li>;
}

export default function TicketSummary({
	tickets,
	onClose,
	savedTickets,
}: Props) {
	const ticketRowElements = tickets.map(
		(ticket: NewTicket | SavedTicket, index: number) => (
			<TicketRow ticket={ticket} key={index} />
		)
	);

	return (
		<Modal onClose={onClose}>
			{/* header */}

			{/* 
            TODO: do we keep StyledContainer with any styles, or do we 
            delegate that part to the  TicketSummary content? 
         */}
			<StyledTicketSummary>{ticketRowElements}</StyledTicketSummary>
			<StyledSubmitButton type="submit">Save these tickets</StyledSubmitButton>
		</Modal>
	);
}

type ModalProps = {
	children: React.ReactNode;
	onClose: (args?: unknown) => void;
};

/** This is our first use-case for a modal. As soon as we find another one,
 * refactor this to use a modal hook/component. */
function Modal({ children, onClose }: ModalProps) {
	return (
		<>
			<StyledOverlay
				onClick={(e) => {
					e.stopPropagation();
				}}
			/>
			<StyledContainer>
				<StyledModalCloseButton onClick={onClose}>
					{/* TODO: close modal on click */}
					<BsX fill="white" />
				</StyledModalCloseButton>
				{children}
			</StyledContainer>
		</>
	);
}
