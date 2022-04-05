import axios from "axios";
import dayjs from "dayjs";
import { useAuth } from "hooks/auth/useAuth";
import { useCallback, useState } from "react";
import { isValidTicket, parseNewTicketInputs } from "./helpers/parse-validate";
import { RawNewTicket } from "./NewTicket";

const today = dayjs(new Date()).format("YYYY-MM-DD");

const defaultNewTicket: Partial<RawNewTicket> = {
	action: "buy",
	date: today,
	time: "09:30",
};

export function useNewTickets() {
	const { user } = useAuth();
	const [ticketCount, setTicketCount] = useState<number>(3);
	const [tickets, setTickets] = useState<Partial<RawNewTicket>[]>(
		new Array(ticketCount).fill(defaultNewTicket)
	);

	function addTicketRows(count: number) {
		setTicketCount((c) => c + count);
		setTickets((tickets) => [...tickets, ...new Array(count).fill(defaultNewTicket)]);
	}

	// TODO: if we add a proper name='action' (and input type='button' if it's not like
	// that yet) to tradeActionButtons, then we can use setField instead of
	// needing a separate setAction function. alternatively, could also combine
	// these two functions into a reducer
	const setAction = (ticketIndex: number, action: RawNewTicket["action"]) => {
		setTickets((tickets) => {
			const ticket = { ...tickets[ticketIndex], action };
			return [
				...tickets.slice(0, ticketIndex),
				ticket,
				...tickets.slice(ticketIndex + 1),
			];
		});
	};

	const setField = (e: React.ChangeEvent<HTMLInputElement>, ticketIndex: number) => {
		const { name, value } = e.target;

		setTickets((tickets) => {
			const ticket = { ...tickets[ticketIndex], [name]: value };
			return [
				...tickets.slice(0, ticketIndex),
				ticket,
				...tickets.slice(ticketIndex + 1),
			];
		});
	};

	const onSubmit = useCallback(
		async (e: any) => {
			e.preventDefault();
			// Parse and validate tickets
			// TODO: if we want to individually validate tickets and return various
			// messages depending on the result of the validation, we might want to
			// handle this differently, e.g. by changing isValidTicket to
			// validateTicket, which updates for example a piece of 'message' state
			// that is then used by the NewTickets component to display validation messages.
			const validTickets = tickets
				.map(parseNewTicketInputs)
				.filter((ticket) => isValidTicket(ticket));

			// If there is at least one valid ticket, send all valid tickets to the
			// backend. Ideally, we would first force the user to handle any
			// invalid tickets, though.

			try {
				const { username } = user;
				if (!username || !validTickets?.length) return;

				await axios.post("t/tickets", { newTickets: validTickets, username });
			} catch (error) {
				console.error(error);
			}
			return;
		},
		[tickets]
	);

	return {
		tickets,
		setAction,
		setField,
		addTicketRows,
		onSubmit,
	} as const;
}
