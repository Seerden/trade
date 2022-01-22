import styled from "styled-components";

const inputHeight = "1.5rem";

export const StyledLabel = styled.label`
    width: 100%;
    background-color: #cfcfcf;
    color: #555;
    font-weight: 500;
    padding: 0.2rem;

    text-indent: 0.2rem;
    font-size: 0.88rem;
    user-select: none;
`;

/** input element */
export const StyledInput = styled.input`
    border: 2px solid #cfcfcf;
    width: 5rem;

    &:active,
    &:focus {
        border: 2px solid #888;
        outline: none;
    }

    line-height: ${inputHeight};
    font-size: 0.8rem;
    text-indent: 0.2rem;
    vertical-align: middle;
    align-items: center;
    height: ${inputHeight};
`;

/** div element intended to wrap (possibly) a label, and one or multiple inputs/buttons */
export const StyledFormField = styled.div<{ width?: string }>`
    display: flex;
    flex-direction: column;
    border-radius: 3px;
    width: ${(p) => p.width ?? "5rem"};

    ${StyledInput} {
        width: 100%;
    }

    margin: 0 0.2em;
`;

export const StyledForm = styled.form`
    display: flex;
`;

/** button element
 * @param hasBorder add border (top, right, buttom), intended for the input toggle in the Date field
 */
export const StyledButton = styled.button<{ hasBorder: boolean }>`
    display: flex;
    border: ${(p) => p.hasBorder && "2px solid #ccc"};
    border-left: none;
    font-size: 0.89rem;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

export const StyledDateInput = styled.span`
    display: grid;
    grid-template-columns: 5fr 1fr;
`;
