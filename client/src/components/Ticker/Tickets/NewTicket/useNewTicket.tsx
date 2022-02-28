import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { TradeAction } from "types/trade.types";

// These are the fields for the NewTicket form. They are to be parsed to
// BuyTicket | SellTicket on submit (or at validation-time)
type NewTicketFromForm = {
    action: `${TradeAction}`;
    ticker: string;
    price: string;
    quantity: string;
    date: string;
    time: string;
};

type Props = {
    logChanges?: boolean;
};

export function useNewTicket({ logChanges = false }: Props) {
    const [ticket, setTicket] = useState<NewTicketFromForm>({
        action: "buy",
        date: dayjs().format("YYYY-MM-DD"),
    } as NewTicketFromForm);

    useEffect(() => {
        if (logChanges) {
            console.log(ticket);
        }
    }, [ticket]);

    // Change handler for the buttons and input elements
    function onChange(
        e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
    ) {
        const { name, value } = e.currentTarget;

        setTicket((current) => ({ ...current, [name]: value }));
    }

    /** Submit handler for the NewTicket form.
     * Note that we're currently just logging the resulting output, since we
     * don't have the API routes set up yet.
     */
    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(ticket);

        // @todo: parse form output to match type BuyTicket | SellTicket
    }

    return { onChange, onSubmit, ticket } as const;
}
