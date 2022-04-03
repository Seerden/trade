import axios from "axios";
import dayjs from "dayjs";
import { useAuth } from "hooks/auth/useAuth";
import { useCallback, useState } from "react";
import { isValidTicket, parseNewTicketInputs } from "./helpers/parse-validate";
import { RawNewTicket } from "./NewTicket";

const today = dayjs(new Date()).format("YYYY-MM-DD");

const defaultNewTicket: Partial<RawNewTicket> = {
	date: today,
	time: "09:30"
};

export function useNewTickets() {
	const { user } = useAuth();
	const [ticketCount, setTicketCount] = useState<number>(3);
	const [tickets, setTickets] = useState<Partial<RawNewTicket>[]>(
		new Array(ticketCount).fill(defaultNewTicket)
	);

	function addTicketRows(count: number) {
		setTicketCount(c => c + count);
		setTickets(tickets => [...tickets, ...new Array(count).fill(defaultNewTicket)]);
	}

	// TODO: if we add a proper name='action' (and input type='button' if it's not like
	// that yet) to tradeActionButtons, then we can use setField instead of
	// needing a separate setAction function. alternatively, could also combine
	// these two functions into a reducer
	const setAction = (ticketIndex: number, action: RawNewTicket["action"]) => {
		setTickets(tickets => {
			const ticket = { ...tickets[ticketIndex], action };
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

	const onSubmit = useCallback(
		async (e: any) => {
			e.preventDefault();
			// parse tickets
			const parsedTickets = tickets.map(parseNewTicketInputs);
			console.log({ parsedTickets });

			// validate tickets
			// do something like parsedTickets.map(validateTicket), and make sure
			// validateTicket (currently isValidTicket) returns some type of
			// message to be set for a piece of message state, like {index,
			// message}
			const validTickets = parsedTickets.filter(ticket => isValidTicket(ticket)); // TODO: this is temporary while I work on implementing the above comment
			console.log({ validTickets });
			// set message if needed

			// make API call if at least one valid ticket (better yet, if no
			// validation issues so user knows what's up)
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
		onSubmit
	} as const;
}
