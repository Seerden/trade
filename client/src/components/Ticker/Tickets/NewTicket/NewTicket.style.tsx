import styled from "styled-components";

export const StyledNewTicket = styled.form`
    display: flex;
    width: max-content;
    flex-direction: column;
    border: ${(p) => p.theme.size.tiny} solid ${(p) => p.theme.colors.blue.deep};
    padding: ${(p) => p.theme.padding.large} ${(p) => p.theme.padding.large};
`;

export const StyledLabel = styled.label`
    font-weight: 500;
    width: 6rem;
    text-align: right;
    margin-right: ${({ theme }) => theme.padding.small};
`;

export const StyledInput = styled.input`
    outline: none;

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
        margin-top: ${({ theme }) => theme.padding.tiny};
    }
`;

export const StyledTitle = styled.h2`
    border-bottom: ${(p) => p.theme.size.tiny} solid ${(p) => p.theme.colors.blue.deep};

    width: 100%;

    font-weight: 600;
    font-size: 1.1rem;

    padding-bottom: ${(p) => p.theme.padding.tiny};
    margin-bottom: ${(p) => p.theme.padding.medium};
`;

export const StyledButton = styled.button`
    display: flex;
    align-self: center;

    border: ${(p) => p.theme.size.tiny} solid ${(p) => p.theme.colors.blue.deep};
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
