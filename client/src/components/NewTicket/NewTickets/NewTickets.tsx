import { StyledButton } from "components/Authentication/Login/Login.style";
import { useMemo } from "react";
import NewTicket from "./NewTicket";
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
	const { tickets, setSide, setField, addTicketRows } = useNewTickets();

	const ticketElements = useMemo(() => {
		return tickets.map((ticket, ticketIndex) => {
			const options = {
				ticketIndex,
				ticket,
				setSide,
				setField
			};
			return <NewTicket key={ticketIndex} {...options} />;
		});
	}, [tickets]);

	return (
		<>
			<Header />
			{ticketElements}
			<StyledButton
				style={{ position: "sticky", bottom: 0 }}
				type="button"
				onClick={() => addTicketRows(3)}
				value="Add 3 rows"
			/>
		</>
	);
}
