import TickerInfo from "./TickerInfo/TickerInfo";
import NewTicket from "./Tickets/NewTicket/NewTicket";
import { Trades } from "./Trades/Trades";

function Ticker() {
    return (
        <div>
            <TickerInfo />
            <Trades ticker={"msft"} />
            <NewTicket />
        </div>
    );
}

export default Ticker;
