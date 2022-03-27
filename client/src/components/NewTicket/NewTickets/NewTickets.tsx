import NewTicket from "./NewTicket";
import Header from "./sub/Header";
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

// for now, pretend we're just creating one ticket, and then expand to multiple
// tickets once the single ticket is functional
export default function NewTickets() {
	const tickets = Object.keys([...Array(3)]).map(index => <NewTicket key={index} />);

	return (
		<>
			<Header />
			{tickets}
		</>
	);
}
