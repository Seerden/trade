import { InputHTMLAttributes } from "react";
import { StyledInput, StyledTitle } from "./NewTicket.style";
import {
    StyledButton,
    StyledHeader,
    StyledHeaderColumn,
    StyledNewTickets,
    StyledRow
} from "./NewTickets.style";

export default function NewTickets() {
    return (
        <StyledNewTickets>
            <StyledTitle>New trade tickets</StyledTitle>
            <StyledHeader>
                {columns.map(column => (
                    <HeaderColumn key={column} labelText={column} />
                ))}
            </StyledHeader>
            {Object.keys([...Array(6)]).map(index => (
                <TicketRow key={index} />
            ))}
            <TicketRow />
            <SubmitButton />
        </StyledNewTickets>
    );
}

const columns = "Action, Ticker, Price, Quantity, Date, Market time".split(", ");

// List of input properties, one per input.
// Make sure the entries are in the same order as `columns`
const fieldProps: InputHTMLAttributes<HTMLInputElement>[] = [
    {
        name: "action",
        type: "text"
    },
    {
        name: "ticker",
        type: "text"
        /**
         * @todo: if this form ends up being on a ticker-specific page, pre-fill
         * this field with the ticker, and possibly even make it non-editable
         */
    },
    {
        name: "price",
        type: "number",
        min: 0,
        step: 0.01
    },
    {
        name: "quantity",
        type: "number",
        min: 0,
        step: 0.1
    },
    {
        name: "date",
        type: "date"
        // @todo: set default value to today's date
    },
    {
        name: "time",
        type: "time"
    }
];

function HeaderColumn({ labelText }: { labelText: string }) {
    return <StyledHeaderColumn>{labelText}</StyledHeaderColumn>;
}

function TicketRow() {
    return (
        <StyledRow>
            {fieldProps.map(inputProps => (
                <StyledInput key={inputProps.name} {...inputProps} />
            ))}
        </StyledRow>
    );
}

function SubmitButton() {
    return <StyledButton type="submit">Save tickets</StyledButton>;
}
