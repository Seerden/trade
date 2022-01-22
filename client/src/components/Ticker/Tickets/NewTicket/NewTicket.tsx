import { useCallback, useState } from "react";
import { FiType } from "react-icons/fi";
import { MdDateRange } from "react-icons/md";
import {
    StyledButton,
    StyledDateInput,
    StyledForm,
    StyledFormField,
    StyledInput,
    StyledLabel,
    StyledSubmitButton,
} from "./NewTicket.style";

function NewTicket() {
    const [inputType, setInputType] = useState<React.HTMLInputTypeAttribute>("text");
    const [price, setPrice] = useState<number | string>("");
    const toggleInputType = useCallback(() => {
        setInputType((current) => (current === "text" ? "datetime-local" : "text"));
    }, [setInputType]);

    function setValueToFixed(e: React.ChangeEvent<HTMLInputElement>, decimals = 2) {
        return (+e.target.value).toFixed(decimals);
    }

    return (
        <StyledForm>
            <StyledFormField>
                {/* <StyledLabel htmlFor="action">Action</StyledLabel> */}
                <Button name="action">buy</Button>
                <Button name="action">sell</Button>
            </StyledFormField>

            <StyledFormField>
                <StyledLabel htmlFor="ticker">Ticker</StyledLabel>
                <StyledInput name="ticker" type="text" />
            </StyledFormField>

            <StyledFormField>
                <StyledLabel htmlFor="quantity">Quantity</StyledLabel>
                <StyledInput name="quantity" type="number" min={0} />
            </StyledFormField>

            <StyledFormField>
                <StyledLabel htmlFor="price">Price</StyledLabel>
                <StyledInput
                    name="price"
                    type="number"
                    step={0.01}
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onBlur={(e) => setPrice(setValueToFixed(e, 2))}
                />
            </StyledFormField>

            <StyledFormField width={"13rem"}>
                <StyledLabel htmlFor="timestamp">Date</StyledLabel>
                <StyledDateInput>
                    <StyledInput name="timestamp" type={inputType} />
                    <Button
                        hasBorder
                        onClick={() => {
                            toggleInputType();
                        }}
                    >
                        {inputType === "datetime-local" ? <FiType /> : <MdDateRange />}
                    </Button>
                </StyledDateInput>
            </StyledFormField>

            <StyledFormField>
                <StyledSubmitButton>Save ticket</StyledSubmitButton>
            </StyledFormField>
        </StyledForm>
    );
}

export default NewTicket;

function Button({
    children,
    hasBorder = false,
    ...buttonProps
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    hasBorder?: boolean;
}): JSX.Element {
    const { name, onClick } = buttonProps;
    return (
        <StyledButton
            hasBorder={hasBorder}
            onClick={(e) => {
                e.preventDefault();
                onClick?.(e);
            }}
            name={name}
        >
            {children}
        </StyledButton>
    );
}
