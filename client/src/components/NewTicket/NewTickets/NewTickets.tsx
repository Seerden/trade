import { useMemo } from "react";
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
		validTickets,
		savedTickets,
		showSummary,
		setShowSummary,
		setAction,
		setField,
		addTicketRows,
		onSubmit,
		deleteTicket,
	} = useNewTickets();

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
				<NewTicket key={`${ticketIndex}+${tickets.length}`} {...options} />
			);
		});
	}, [tickets]);

	return (
		<>
			<StyledNewTickets onSubmit={onSubmit}>
				{/*   
               Render TicketSummary inside the form, so that any submit buttons 
               in there trigger this form's onSubmit handler */}
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

type ButtonProps = {
	addTicketRows: (_: number) => void;
	setShowSummary: (_: boolean) => void;
};

function Buttons({ addTicketRows, setShowSummary }: ButtonProps) {
	return (
		<StyledButtons>
			<StyledButtonWrapper>
				<span>
					{/*   TODO: should become a button with on-hover effect: start as green 
                     button with arrow, slide text into it on hover */}
					<StyledButton
						type="button"
						value="Save tickets"
						onClick={() => {
							// TODO: only show preview if there is at least one valid
							// ticket. The best way to do this is probably a function
							// like maybeShowSummary that only calls setShowSummary if
							// !!validTickets.length. Then we can pass this function to
							// this Buttons component without also needing to pass validTickets
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
