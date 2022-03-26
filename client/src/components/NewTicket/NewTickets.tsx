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

function renderActionButtons() {
	return sides.map((side: "buy" | "sell") => (
		<TradeActionButton key={side} side={side} />
	));
}

export default function NewTickets() {
	return <>{renderActionButtons()}</>;
}
