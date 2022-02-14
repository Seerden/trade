import dayjs from "dayjs";
import {
    StyledButton,
    StyledBuySellButton,
    StyledField,
    StyledLabel,
    StyledNewTicket,
    StyledTitle,
} from "./NewTicket.style";
import { Field } from "./NewTickets.sub";
import { useNewTicket } from "./useNewTicket";

function NewTicket() {
    const { onChange, onSubmit, ticket } = useNewTicket(false);

    return (
        <StyledNewTicket onSubmit={(e) => onSubmit(e)}>
            <StyledTitle>New trade ticket</StyledTitle>

            <StyledField>
                <StyledLabel htmlFor="action">Action</StyledLabel>
                <div style={{ width: "100%" }}>
                    <StyledBuySellButton
                        type="button"
                        name="action"
                        action="buy"
                        value="buy"
                        selected={ticket.action === "buy"}
                        style={{ width: "50%" }}
                        onClick={onChange}
                    >
                        Buy
                    </StyledBuySellButton>
                    <StyledBuySellButton
                        type="button"
                        name="action"
                        action="sell"
                        value="sell"
                        selected={ticket.action === "sell"}
                        style={{ width: "50%" }}
                        onClick={onChange}
                    >
                        Sell
                    </StyledBuySellButton>
                </div>
            </StyledField>

            <Field
                htmlFor="ticker"
                label="Ticker"
                inputProps={{
                    onChange,
                }}
            />

            <Field
                htmlFor="price"
                label="Price"
                inputProps={{
                    type: "number",
                    onChange: (e) => onChange(e),
                }}
            />

            <Field
                htmlFor="quantity"
                label="Quantity"
                inputProps={{
                    type: "number",
                    onChange,
                }}
            />

            <Field
                htmlFor="date"
                label="Date"
                inputProps={{
                    type: "date",
                    onChange,
                    defaultValue: dayjs().format("YYYY-MM-DD"), // default to today
                }}
            />
            <Field
                htmlFor="time"
                label="Market time"
                inputProps={{
                    type: "time",
                    onChange,
                }}
            />

            <StyledButton type="submit">Save ticket</StyledButton>
        </StyledNewTicket>
    );
}

export default NewTicket;
