/**
 * @todo: this file still uses a bunch of --vars, we want to fully convert these
 * to shared styles eventually
 *
 * @todo: want to match the width of StyledButtons with the width of the inputs
 * for a more consistent UI feel
 */

import styled, { css } from "styled-components";

export const StyledForm = styled.form`
    padding: 2em 4em;
    margin: 2em;
    width: max-content;
    margin: 2em auto;

    border: 1px solid var(--main);
    box-shadow: 0 0 0.5em 0 var(--main);
`;

export const StyledFields = styled.div`
    display: flex;
    flex-flow: column wrap;
    gap: var(--pad-medium);
    justify-content: center;
`;

export const StyledLabel = styled.label`
    display: flex;
    font-size: var(--text-small);
    padding-left: var(--pad-small);
    margin-bottom: 0.3em;
    user-select: none;
`;

export const StyledTitle = styled.h2`
    font-size: 1.5em;
    margin-bottom: var(--pad-medium);
    user-select: none;
`;

export const StyledButtons = styled.div`
    display: flex;
    justify-content: space-between;
    gap: var(--pad-medium);
`;

export const StyledInput = styled.input`
    font-size: var(--text-medium);
    padding: var(--pad-small);
    text-indent: calc(2 * var(--pad-small));

    border: 1px solid var(--secondary);
    outline: none;

    &:focus,
    &:hover {
        outline: 1px solid var(--secondary);
    }
`;

export const StyledButton = styled.input<{ isRegisterButton?: boolean }>`
    padding: var(--pad-medium) 2em;
    font-size: var(--text-small);
    outline: 1px solid transparent;

    transition: all 75ms ease-out;

    &:hover,
    &:focus,
    &:active {
        outline: 1px solid var(--secondary);
    }

    ${p =>
        p.isRegisterButton &&
        css`
            background-color: var(--light);
            color: var(--dark-tint);
        `}
`;
