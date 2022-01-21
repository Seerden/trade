import { getTradeInfo } from "helpers/trade-helpers/trade-info";
import { FaPlusCircle } from "react-icons/fa";
import { BuyTicket, SellTicket, Trade } from "types/trade.types";
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

export function TradeCard({ trade }: { trade: Trade }) {
    const { meanBuy, meanSell, quantity } = getTradeInfo(trade);

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
            <StyledTradeCardQuantity>{quantity} shares</StyledTradeCardQuantity>
            <StyledTradeCardAverages>
                <StyledTradeCardExpandTickets>
                    <FaPlusCircle />
                </StyledTradeCardExpandTickets>
                <StyledTradeCardAverage>
                    <span>avg. sell</span>
                    <span>{meanSell.toFixed(2)}</span>
                </StyledTradeCardAverage>
                <StyledTradeCardAverage>
                    <span>avg. buy</span>
                    <span>{meanBuy.toFixed(2)}</span>
                </StyledTradeCardAverage>
            </StyledTradeCardAverages>
            <StyledTradeCardChart>CHART HERE</StyledTradeCardChart>
        </StyledTradeCardGrid>
    );
}

const mockTrade: [BuyTicket, SellTicket] = [
    {
        action: "buy",
        price: 5.01,
        quantity: 2500,
        ticker: "MSFT",
        timestamp: new Date().valueOf(),
    },
    {
        action: "sell",
        price: 5.25,
        quantity: 2500,
        ticker: "MSFT",
        timestamp: new Date().valueOf(),
    },
];

export function Trades({ ticker }: { ticker: string }) {
    return <TradeCard trade={mockTrade} />;
}
