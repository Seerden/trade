import styled from "styled-components";
import { StyledInput } from "./NewTicket.style";

export const StyledHeader = styled.div`
    margin-top: 1rem;
    border: 2px solid #666;
    width: max-content;
`;

const inputWidth = "8.5rem";

export const StyledHeaderColumn = styled.span`
    display: inline-flex;
    // unify this with field widths, maybe use a snippet
    width: ${inputWidth};
    justify-content: center;
    font-size: 0.88rem;
    font-weight: 500;
    padding: 0.5rem 1rem;

    &:not(:nth-of-type(1)) {
        // match this with StyledHeader border style
        border-left: 2px solid #666;
    }
`;

export const StyledRow = styled.div`
    display: flex;
    margin-top: 0.8rem;

    // match StyledHeader border
    border: 2px solid #666;
    width: max-content;

    ${StyledInput} {
        width: ${inputWidth};
        font-size: 0.78rem;
    }
`;
