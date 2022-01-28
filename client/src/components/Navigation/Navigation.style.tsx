import styled from "styled-components";

const offset = "3px";

export const Wrapper = styled.nav`
    position: absolute;
    top: 10vh;
    box-shadow: ${offset} ${offset} 0 0 #ddd;

    border-radius: 4px;
    border: 3px solid #ccc;
    border-left: none;

    padding: 1rem;
    padding-left: 0.3rem;
`;

export const NavList = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    grid-gap: 1.3rem;
`;

export const ListItem = styled.li`
    &:not(nth-of-type(1)) {
        margin-top: 0.7rem;
    }
`;
