import { useEffect, useMemo, useState } from "react";
import TradeActionButton from "./sub/TradeActionButton";
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

const sides = "buy sell".split(" ");

type NewTicket = {
	// @todo: use type
	side: "buy" | "sell";
	ticker: string;
	quantity: number;
	date: string;
	time: string;
	price: number;
};

// for now, pretend we're just creating one ticket, and then expand to multiple
// tickets once the single ticket is functional
export default function NewTickets() {
	const [ticket, setTicket] = useState({
		side: "buy"
	} as Partial<NewTicket>);

	const setSide = (side: NewTicket["side"]) => {
		setTicket(cur => ({ ...cur, side: side }));
	};

	useEffect(() => {
		if (ticket) {
			console.log(ticket);
		}
	}, [ticket]);

	const actionButtons = useMemo(
		() =>
			sides.map((side: "buy" | "sell") => {
				const active = ticket?.side === side;

				return (
					<TradeActionButton
						key={side}
						side={side}
						active={active}
						onClick={() => {
							setSide(side);
						}}
					/>
				);
			}),
		[ticket]
	);

	return (
		<>
			{/* labels/header columns first */}

			{/* fields inputs/buttons in order */}

			{/* action buttons */}
			{actionButtons}

			{/* ticker field */}
			{/* <StyledInput /> */}
		</>
	);
}
