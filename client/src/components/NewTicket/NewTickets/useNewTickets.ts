import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { RawNewTicket } from "./NewTicket";

const today = dayjs(new Date()).format("YYYY-MM-DD");

const defaultNewTicket: Partial<RawNewTicket> = {
	side: "buy",
	date: today,
	time: "09:30"
};

export function useNewTickets() {
	const [ticketCount, setTicketCount] = useState<number>(3);
	const [tickets, setTickets] = useState<Partial<RawNewTicket>[]>(
		new Array(ticketCount).fill(defaultNewTicket)
	);

	function addTicketRows(count: number) {
		setTicketCount(c => c + count);
		setTickets(tickets => [...tickets, ...new Array(count).fill(defaultNewTicket)]);
	}

	// TODO: if we add a proper name='side' (and input type='button' if it's not like
	// that yet) to tradeActionButtons, then we can use setField instead of
	// needing a separate setSide function. alternatively, could also combine
	// these two functions into a reducer
	const setSide = (ticketIndex: number, side: RawNewTicket["side"]) => {
		setTickets(tickets => {
			const ticket = { ...tickets[ticketIndex], side };
			return [
				...tickets.slice(0, ticketIndex),
				ticket,
				...tickets.slice(ticketIndex + 1)
			];
		});
	};

	const setField = (e: React.ChangeEvent<HTMLInputElement>, ticketIndex: number) => {
		const { name, value } = e.target;

		setTickets(tickets => {
			const ticket = { ...tickets[ticketIndex], [name]: value };
			return [
				...tickets.slice(0, ticketIndex),
				ticket,
				...tickets.slice(ticketIndex + 1)
			];
		});
	};

	const onSubmit = useCallback(() => {
		// parse tickets
		// validate tickets
		// set message if needed
		// make API call if at least one valid ticket (better yet, if no
		// validation issues so user knows what's up)
		return;
	}, []);

	return {
		tickets,
		setSide,
		setField,
		addTicketRows,
		onSubmit
	} as const;
}
