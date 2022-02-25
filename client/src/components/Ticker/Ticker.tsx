import NewTicket from "./Tickets/NewTicket/NewTicket";
import { Trades } from "./Trades/Trades";

function Ticker() {
    return (
        <div>
            <Trades ticker={"msft"} />
            <NewTicket />
        </div>
    );
}

export default Ticker;
