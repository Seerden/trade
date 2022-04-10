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
import { StyledContainer, StyledOverlay } from "./TicketSummary.style";
import type { SavedTicket } from "./useNewTickets";

type Props = {
	tickets: NewTicket[] | SavedTicket[];
	onClose: () => void;
};

const StyledTicketSummary = styled.ul`
	width: max-content;
`;

function TicketRow({ ticket }: { ticket: NewTicket | SavedTicket }) {
	const ticketString = makeTicketString(ticket);

	// TODO: will become a StyledTicketRow, because we probably want some styling
	return <li>{ticketString}</li>;
}

export default function TicketSummary({ tickets, onClose }: Props) {
	const ticketRowElements = tickets.map((ticket, index) => (
		<TicketRow ticket={ticket} key={index} />
	));

	return (
		<Modal onClose={onClose}>
			{/* header */}

			{/* 
            TODO: do we keep StyledContainer with any styles, or do we 
            delegate that part to the  TicketSummary content? 
         */}
			<StyledTicketSummary>{ticketRowElements}</StyledTicketSummary>
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
				<StyledBtn onClick={onClose}>
					{/* TODO: close modal on click */}
					<BsX fill="white" />
				</StyledBtn>
				{children}
			</StyledContainer>
		</>
	);
}

// TODO: all of this styling is WIP and should at least be refactored to theme values
const StyledBtn = styled.button`
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
