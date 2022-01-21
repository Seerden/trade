import { FaPlusCircle } from "react-icons/fa";
import { Trade } from "types/trade.types";
import {
    StyledTradeCardAverage,
    StyledTradeCardAverages,
    StyledTradeCardChart,
    StyledTradeCardExpandTickets,
    StyledTradeCardGrid,
    StyledTradeCardProfit,
    StyledTradeCardQuantity,
    StyledTradeCardType,
    StyledTradeCardTypeWrapper,
    StyledTradeDateRange,
} from "./Trades.style";

const mockTrade: Trade = [
    {
        action: "buy",
        price: 1.0,
        quantity: 1000,
        ticker: "BBIG",
        timestamp: new Date().valueOf(),
    },
    {
        action: "sell",
        price: 1.0,
        quantity: 1000,
        ticker: "BBIG",
        timestamp: new Date().valueOf(),
    },
];

export function TradeCard({ trade }: { trade: Trade }) {
    return (
        <StyledTradeCardGrid>
            <StyledTradeCardTypeWrapper>
                <StyledTradeCardType type={"long"}>Short</StyledTradeCardType>
                <StyledTradeDateRange>
                    <div>2022-01-10</div>
                    <div>2022-01-10</div>
                </StyledTradeDateRange>
            </StyledTradeCardTypeWrapper>
            <StyledTradeCardProfit>+$950.00</StyledTradeCardProfit>
            <StyledTradeCardQuantity>2500 shares</StyledTradeCardQuantity>
            <StyledTradeCardAverages>
                <StyledTradeCardExpandTickets>
                    <FaPlusCircle />
                </StyledTradeCardExpandTickets>
                <StyledTradeCardAverage>
                    <span>avg. entry</span>
                    <span>5.28</span>
                </StyledTradeCardAverage>
                <StyledTradeCardAverage>
                    <span>avg. exit</span>
                    <span>5.08</span>
                </StyledTradeCardAverage>
            </StyledTradeCardAverages>
            <StyledTradeCardChart>CHART HERE</StyledTradeCardChart>
        </StyledTradeCardGrid>
    );
}

export function Trades({ ticker }: { ticker: string }) {
    return <TradeCard trade={[]} />;
}
