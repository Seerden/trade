import { useEffect, useState } from "react";
import { BuyTicket, SellTicket } from "types/trade.types";

type NewTicket = Omit<BuyTicket | SellTicket, "timestamp"> & {
    timestamp: string;
};

export function useNewTicket(logChanges = false) {
    const [ticket, setTicket] = useState<NewTicket>({
        action: "buy",
    } as NewTicket);

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

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(ticket);
    }

    return { onChange, onSubmit, ticket } as const;
}
