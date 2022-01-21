import styled, { css } from "styled-components";
import { TradeType } from "types/trade.types";

const centered = css`
    justify-content: center;
    align-items: center;
`;

export const StyledTradeCardGrid = styled.div`
    min-width: max-content;
    padding: 0.5em;
    margin: 1em;
    display: grid;
    grid-template-areas:
        "a b b"
        "c d d"
        "e d d";

    max-width: min(70%, 700px);
    border-radius: 8px;
    border: 2px solid #ccc;
    box-shadow: 0 0 1em 0 #ddd;

    /* give each section of the grid some padding and shadow */
    & > div {
        padding: 0.5em 0;
        box-shadow: 0 0 0.2em 0 #ccc;
    }
`;

type TradeCardTypeProps = {
    type: `${TradeType}`;
};

export const StyledTradeCardType = styled.div<TradeCardTypeProps>`
    color: ${(p) => (p.type === "long" ? "seagreen" : "orangered")};
`;

export const StyledTradeDateRange = styled.div``;

export const StyledTradeCardTypeWrapper = styled.div`
    grid-area: a;
    display: grid;
    grid-template-columns: 1fr 1.5fr;

    ${StyledTradeCardType} {
        display: flex;
        ${centered}
    }
`;

export const StyledTradeCardProfit = styled.div`
    grid-area: b;
    display: flex;
    ${centered}
`;

export const StyledTradeCardQuantity = styled.div`
    grid-area: c;
    display: flex;
    ${centered}
`;

export const StyledTradeCardAverages = styled.div`
    grid-area: e;
    display: flex;
    flex-direction: column;
    position: relative;
`;

export const StyledTradeCardAverage = styled.span`
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    transform: translateX(2em);
    gap: 0.5em;
`;

const buttonSize = "2em";

export const StyledTradeCardExpandTickets = styled.button`
    position: absolute;
    top: calc(50% - ${buttonSize} / 2);
    left: calc(-${buttonSize} / 2);
    width: ${buttonSize};
    height: ${buttonSize};
    border-radius: 50%;
    border: 2px solid #ccc;
    display: flex;
    ${centered}
`;

export const StyledTradeCardChart = styled.div`
    grid-area: d;
    display: flex;
    ${centered}
    height: 100%;
    background-color: #eee;
    color: #8a8a8a;
`;
