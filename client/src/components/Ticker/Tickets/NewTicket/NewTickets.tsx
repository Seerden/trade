import { InputHTMLAttributes } from "react";
import { StyledInput } from "./NewTicket.style";
import { StyledHeader, StyledHeaderColumn, StyledRow } from "./NewTickets.style";

export default function NewTickets() {
    return <Header />;
}

const columns = "Action, Ticker, Price, Quantity, Date, Market time".split(", ");

const fieldProps: InputHTMLAttributes<HTMLInputElement>[] = [
    {
        name: "action",
        type: "text"
    },
    {
        name: "ticker",
        type: "text"
    },
    {
        name: "price",
        type: "number"
    },
    {
        name: "quantity",
        type: "number"
    },
    {
        name: "date",
        type: "date"
    },
    {
        name: "time",
        type: "time"
    }
];

function Header(): JSX.Element {
    return (
        <>
            <StyledHeader>
                {columns.map(column => (
                    <HeaderColumn key={column} labelText={column} />
                ))}
            </StyledHeader>
            <>
                <StyledRow>
                    <TicketRow />
                </StyledRow>
            </>
        </>
    );
}

function HeaderColumn({ labelText }: { labelText: string }) {
    return <StyledHeaderColumn>{labelText}</StyledHeaderColumn>;
}

function TicketRow() {
    return (
        <>
            {fieldProps.map(inputProps => (
                <StyledInput key={inputProps.name} {...inputProps} />
            ))}
        </>
    );
}
