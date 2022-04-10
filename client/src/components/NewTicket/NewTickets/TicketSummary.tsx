import { useMemo } from "react";
/**
 * This component encompasses two steps of the NewTicket(s) creation process:
 * - user clicks "preview tickets" => preview all tickets so the user can verify
 *   their input.
 * - if in preview screen and user clicks "save tickets", make POST request and,
 *   based on response, highlight the tickets from preview screen that were
 *   saved to the database successfully
 */
import { BsX } from "react-icons/bs";
import { useNavigate } from "react-router";
import type { NewTicket, SavedTicket } from "types/tickets";
import { isSavedTicket } from "./helpers/saved-tickets-match";
import { makeTicketString } from "./helpers/ticket-string";
import {
   StyledContainer,
   StyledModalCloseButton,
   StyledOverlay,
   StyledSubmitButton,
   StyledTicketRow,
   StyledTicketSummary
} from "./TicketSummary.style";

type Props = {
	tickets: NewTicket[];
	onClose: () => void;
	savedTickets: SavedTicket[];
};

function TicketRow({
	ticket,
	saved,
}: {
	ticket: NewTicket | SavedTicket;
	saved?: boolean;
}) {
	const ticketString = makeTicketString(ticket);

	return <StyledTicketRow saved={saved}>{ticketString}</StyledTicketRow>;
}

export default function TicketSummary({
	tickets,
	onClose,
	savedTickets,
}: Props) {
   const navigate = useNavigate();

	const ticketRowElements = useMemo(() => {
		return tickets.map((ticket: NewTicket, index: number) => (
			<TicketRow
				ticket={ticket}
				key={index}
				saved={savedTickets?.length && isSavedTicket(ticket, savedTickets)}
			/>
		));
	}, [tickets, savedTickets]);

	return (
		<Modal onClose={onClose}>
			{/* header */}

			{/* 
            TODO: do we keep StyledContainer with any styles, or do we 
            delegate that part to the  TicketSummary content? 
         */}
			<StyledTicketSummary>{ticketRowElements}</StyledTicketSummary>

         {/* If no submit -> response cycle has been completed yet, display the submit button */}
         {!savedTickets?.length ? (

            <StyledSubmitButton type="submit">Save these tickets</StyledSubmitButton>
         ) : (
            <StyledSubmitButton type="reset" onClick={() => navigate(0)}>Add more tickets</StyledSubmitButton>
         )}
         {/* Otherwise, display button(s) for navigation, reload, etc. */}

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
