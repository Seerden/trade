import styled, { css } from "styled-components";
import { TradeAction } from "types/trade.types";

export const StyledNewTicket = styled.form`
    display: flex;
    width: max-content;
    flex-direction: column;
    border: ${(p) => p.theme.size.tiny} solid ${(p) => p.theme.colors.grey.regular};
    padding: ${(p) => p.theme.padding.large} ${(p) => p.theme.padding.large};
`;

export const StyledLabel = styled.label`
    font-weight: 500;
    width: 9rem;
    text-align: right;
    margin-right: ${({ theme }) => theme.padding.small};
`;

export const StyledInput = styled.input`
    outline: none;
    width: 100%;
    padding: ${(p) => p.theme.padding.tiniest};
    text-indent: ${(p) => p.theme.padding.tiniest};

    &:hover,
    &:active {
        outline: none;
    }

    border: 2px solid ${({ theme }) => theme.colors.grey.light};
`;

export const StyledField = styled.div`
    display: flex;
    align-items: center;

    &:not(:nth-of-type(1)) {
        padding: ${({ theme }) => theme.padding.tiny} 0;
    }
`;

export const StyledTitle = styled.h2`
    border-bottom: ${(p) => p.theme.size.tiny} solid ${(p) => p.theme.colors.grey.regular};

    width: 100%;

    font-weight: 600;
    font-size: 1.1rem;

    padding-bottom: ${(p) => p.theme.padding.tiny};
    margin-bottom: ${(p) => p.theme.padding.medium};
`;

export const StyledButton = styled.button`
    display: flex;
    align-self: center;

    border: ${(p) => p.theme.size.tiny} solid ${(p) => p.theme.colors.grey.regular};
    background: none;
    font-weight: 600;

    padding: ${(p) => p.theme.padding.tiny};
    margin-top: ${(p) => p.theme.padding.small};

    width: 8rem;
    font-size: 0.8rem;
    justify-content: center;
    border-radius: 5px;

    transition: all 45ms ease-out;

    &:hover,
    &:focus {
        transform: translateY(-2px);
        box-shadow: 0 2px 0 0 ${(p) => p.theme.colors.grey.light};
    }
`;

function colorByAction(action: `${TradeAction}`) {
    switch (action) {
        case "buy":
            return "forestgreen";
        case "sell":
            return "orange";
    }
}

const shadow = css`
    box-shadow: 0 0 0.2rem ${(p) => p.theme.colors.grey.regular};
`;

export const StyledBuySellButton = styled.button<{
    action: `${TradeAction}`;
    selected?: boolean;
}>`
    color: ${(p) => (p.action === "buy" ? "seagreen" : "orange")};
    padding: ${({ theme }) => theme.padding.tiny};

    font-weight: 600;
    background-color: transparent;

    border: 2px solid ${(p) => (p.selected ? colorByAction(p.action) : "transparent")};

    transition: all 75ms ease-in;

    // set box-shadow on hover, and also on the selected button
    ${(p) =>
        p.selected &&
        css`
            ${shadow}
        `}

    &:hover {
        ${shadow}
    }
`;
