import { ChangeEvent, useCallback, useState } from "react";
import { FiType } from "react-icons/fi";
import { MdDateRange } from "react-icons/md";
import {
    StyledDateInput,
    StyledForm,
    StyledFormField,
    StyledInput,
    StyledLabel,
    StyledSubmitButton,
} from "./NewTicket.style";
import { Button, Input } from "./NewTickets.sub";

function NewTicket() {
    const [inputType, setInputType] = useState<React.HTMLInputTypeAttribute>("text");
    const [price, setPrice] = useState<number | string>("");
    const toggleInputType = useCallback(() => {
        setInputType((current) => (current === "text" ? "datetime-local" : "text"));
    }, [setInputType]);

    function setValueToFixed(e: ChangeEvent<HTMLInputElement>, decimals = 2) {
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
                <Input name="ticker" type="text" />
            </StyledFormField>

            <StyledFormField>
                <StyledLabel htmlFor="quantity">Quantity</StyledLabel>
                <StyledInput name="quantity" type="number" min={0} />
            </StyledFormField>

            <StyledFormField>
                <StyledLabel htmlFor="price">Price</StyledLabel>
                <Input name="price" type="number" step={0.01} min={0} />
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
