import { useMemo } from "react";
import NewTicket from "./NewTicket";
import {
	StyledButton,
	StyledButtons,
	StyledButtonWrapper,
	StyledNewTickets,
	StyledSubtitle,
	StyledTickets,
	StyledTitle
} from "./NewTickets.style";
import Header from "./sub/Header";
import { useNewTickets } from "./useNewTickets";

/**
   Form to create new tickets. Acts like one large form, but UX should feel like a Google
   Sheet. Implementation, as it stands, is more like just a form though.
   
   Form fields:
      - action:      buy/sell buttons
      - ticker:      text input
      - quantity:    number input (integers or fractionals)
      - datetime:    date:
                        date input
                     market time:
                        time input
      - price:       number input, 2-4 decimals, depending on current price value
*/
export default function NewTickets() {
	const {
		tickets,
		setAction,
		setField,
		addTicketRows,
		onSubmit,
		deleteTicket
	} = useNewTickets();

	const ticketElements = useMemo(() => {
		return tickets.map((ticket, ticketIndex) => {
			const options = {
				ticketIndex,
				ticket,
				setAction,
				setField,
				deleteTicket
			};
			return <NewTicket key={`${ticketIndex}+${tickets?.length}`} {...options} />;
		});
	}, [tickets]);

	return (
		<>
			<StyledNewTickets onSubmit={onSubmit}>
				<StyledTitle>Add new trade tickets</StyledTitle>
				<StyledSubtitle>
					Each ticket describes one buy or sell transaction.
				</StyledSubtitle>
				<StyledTickets>
					<Buttons addTicketRows={addTicketRows} />
					<Header />
					{ticketElements}
				</StyledTickets>
			</StyledNewTickets>
		</>
	);
}

function Buttons({ addTicketRows }: { addTicketRows: (_: number) => void }) {
	return (
		<StyledButtons>
			<StyledButtonWrapper>
				<span>
					<StyledButton type="submit" value="Save tickets" />
				</span>
				<span>
					<StyledButton
						round
						type="button"
						onClick={() => addTicketRows(3)}
						value="+"
						title="Add 3 rows"
					/>
					<StyledButton round type="button" value="x" title="Delete empty tickets" />
				</span>
			</StyledButtonWrapper>
		</StyledButtons>
	);
}
