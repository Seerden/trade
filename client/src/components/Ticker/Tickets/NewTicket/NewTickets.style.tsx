import styled from "styled-components";
import { StyledInput } from "./NewTicket.style";

export const StyledNewTickets = styled.form`
    // @todo: unify border styles for things like page sections
    border: 2px solid #ccc;
    border-radius: 5px;
    padding: ${p => p.theme.padding.tiny} ${p => p.theme.padding.medium};
`;

export const StyledHeader = styled.div`
    width: max-content;
    display: flex;
    gap: ${p => p.theme.padding.small};
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
    border: ${p => p.theme.padding.small} solid transparent;
    border-bottom: 2px solid ${p => p.theme.colors.grey.light};
`;

export const StyledRow = styled.div`
    display: flex;
    margin-top: 0.8rem;

    width: max-content;
    gap: ${p => p.theme.padding.small};

    ${StyledInput} {
        width: ${inputWidth};
        font-size: 0.78rem;
    }
`;

export const StyledButton = styled.button`
    margin-top: ${p => p.theme.padding.medium};
    padding: ${p => p.theme.padding.small} ${p => p.theme.padding.medium};
`;
