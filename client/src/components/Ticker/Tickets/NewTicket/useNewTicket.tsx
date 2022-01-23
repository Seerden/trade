import { useCallback, useEffect, useState } from "react";
import { Ticket } from "types/trade.types";

export function useNewTicket() {
    const [ticket, setTicket] = useState<Ticket>({} as Ticket);

    useEffect(() => {
        console.log(ticket);
    }, [ticket]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>): void => {
            const { name, value } = e.target;
            setTicket((ticket) => {
                return { ...ticket, [name]: value };
            });
        },
        [setTicket]
    );

    return [handleChange] as const;
}
