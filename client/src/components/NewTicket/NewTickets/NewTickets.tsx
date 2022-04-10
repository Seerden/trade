import { useMemo, useState } from "react";
import NewTicket from "./NewTicket";
import {
	StyledButton,
	StyledButtons,
	StyledButtonWrapper,
	StyledNewTickets,
	StyledSubtitle,
	StyledTickets,
	StyledTitle,
} from "./NewTickets.style";
import Header from "./sub/Header";
import TicketSummary from "./TicketSummary";
import { useNewTickets } from "./useNewTickets";

/**
 * Form that allows for creation of new trade tickets.
 */
export default function NewTickets() {
	const {
		tickets,
		setAction,
		setField,
		addTicketRows,
		onSubmit,
		validTickets,
		deleteTicket,
		savedTickets,
	} = useNewTickets();

	// TODO: TicketSummary step - state should be moved to useNewTickets once
	// done
	const [showSummary, setShowSummary] = useState<boolean>(false);

	const ticketElements = useMemo(() => {
		return tickets.map((ticket, ticketIndex) => {
			const options = {
				ticketIndex,
				ticket,
				setAction,
				setField,
				deleteTicket,
			};
			return (
				<NewTicket key={`${ticketIndex}+${tickets?.length}`} {...options} />
			);
		});
	}, [tickets]);

	return (
		<>
			<StyledNewTickets onSubmit={onSubmit}>
				{showSummary && validTickets?.length > 0 && (
					<TicketSummary
						tickets={validTickets}
						savedTickets={savedTickets}
						onClose={() => {
							setShowSummary(false);
						}}
					/>
				)}
				<StyledTitle>Add new trade tickets</StyledTitle>
				<StyledSubtitle>
					Each ticket describes one buy or sell transaction.
				</StyledSubtitle>
				<StyledTickets>
					<Buttons
						addTicketRows={addTicketRows}
						setShowSummary={setShowSummary}
					/>
					<Header />
					{ticketElements}
				</StyledTickets>
			</StyledNewTickets>
		</>
	);
}

function Buttons({
	addTicketRows,
	setShowSummary,
}: {
	addTicketRows: (_: number) => void;
	setShowSummary: (bool: boolean) => void;
}) {
	return (
		<StyledButtons>
			<StyledButtonWrapper>
				<span>
					{/*   should become a button with on-hover effect: start as green 
                     button with arrow, slide text into it on hover */}
					<StyledButton
						type="button"
						value="Save tickets"
						onClick={() => {
							// TODO: only show preview if there is at least one valid ticket
							setShowSummary(true);
						}}
					/>
				</span>
				<span>
					<StyledButton
						round
						type="button"
						onClick={() => addTicketRows(3)}
						value="+"
						title="Add 3 rows"
					/>
					<StyledButton
						round
						type="button"
						value="x"
						title="Delete empty tickets"
					/>
				</span>
			</StyledButtonWrapper>
		</StyledButtons>
	);
}
