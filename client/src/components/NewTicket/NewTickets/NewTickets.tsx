import { useMemo } from "react";
import NewTicket from "./NewTicket";
import Header from "./sub/Header";
import { useNewTickets } from "./useNewTickets";
/**
   table of new tickets, acts like one large form, but should feel like a google
   sheet
   

   fields:
      - action
         - buy/sell buttons
      - ticker
         - text input
      - quantity
         - number input (integers)
      - datetime;
         - date
            - date input
         - market time
            - time input
      - price
         - number input, 2-4 decimals


*/

export default function NewTickets() {
	const { tickets, setSide, setField } = useNewTickets();

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
		</>
	);
}
