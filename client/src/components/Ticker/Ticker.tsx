import TickerInfo from "./TickerInfo/TickerInfo";
import { Trades } from "./Trades/Trades";

function Ticker() {
    return (
        <div>
            <TickerInfo />
            <Trades ticker={"msft"} />
        </div>
    );
}

export default Ticker;
