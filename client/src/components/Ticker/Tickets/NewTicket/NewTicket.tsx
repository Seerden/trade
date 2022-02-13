import { StyledButton, StyledNewTicket, StyledTitle } from "./NewTicket.style";
import { Field } from "./NewTickets.sub";

function NewTicket() {
    return (
        <StyledNewTicket>
            <StyledTitle>New trade ticket</StyledTitle>
            <Field htmlFor="ticker" label="Ticker" />

            <Field
                htmlFor="price"
                label="Price"
                inputProps={{
                    type: "number",
                }}
            />

            <Field
                htmlFor="quantity"
                label="Quantity"
                inputProps={{
                    type: "number",
                }}
            />

            <Field
                htmlFor="datetime"
                label="Date & time"
                inputProps={{
                    type: "text",
                }}
            />

            <StyledButton type="submit">Save ticket</StyledButton>
        </StyledNewTicket>
    );
}

export default NewTicket;
