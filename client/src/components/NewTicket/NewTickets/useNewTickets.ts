import dayjs from "dayjs";
import useAxios from "helpers/api/axios-instance";
import { useAuth } from "hooks/auth/useAuth";
import { useCallback, useMemo, useState } from "react";
import { SavedTicket } from "types/tickets";
import { isValidTicket, parseNewTicketInputs } from "./helpers/parse-validate";
import { RawNewTicket } from "./NewTicket";

const today = dayjs(new Date()).format("YYYY-MM-DD");

const defaultNewTicket: Partial<RawNewTicket> = {
	date: today,
	time: "09:30",
};

export function useNewTickets() {
	const { user } = useAuth();
	const axios = useAxios();
	const [ticketCount, setTicketCount] = useState<number>(5);
	const [tickets, setTickets] = useState<Partial<RawNewTicket>[]>(
		new Array(ticketCount).fill(defaultNewTicket)
	);
	const [savedTickets, setSavedTickets] = useState<SavedTicket[]>(null);

	// Parse and validate tickets.
	const validTickets = useMemo(() => {
		return tickets
			.map(parseNewTicketInputs)
			.filter((ticket) => isValidTicket(ticket));
	}, [tickets]);

	function addTicketRows(count: number) {
		setTicketCount((c) => c + count);
		setTickets((tickets) => [
			...tickets,
			...new Array(count).fill(defaultNewTicket),
		]);
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

	const setField = (
		e: React.ChangeEvent<HTMLInputElement>,
		ticketIndex: number
	) => {
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
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			try {
				const { username } = user;
				if (!username || !validTickets?.length) return;

				const { data } = await axios.post("t/tickets", {
					newTickets: validTickets,
					username,
				});
				setSavedTickets(data?.savedTickets ?? null);
			} catch (error) {
				console.error(error);
			}
			return;
		},
		[validTickets]
	);

	// Delete ticket a index `index`, but only if it's not the last remaining
	// ticket.
	function deleteTicket(index: number) {
		setTickets((tickets) => {
			if (tickets?.length > 1) {
				return [...tickets.slice(0, index), ...tickets.slice(index + 1)];
			} else {
				return tickets;
			}
		});
	}

	return {
		tickets,
		validTickets,
		setAction,
		setField,
		addTicketRows,
		onSubmit,
		deleteTicket,
		savedTickets,
	} as const;
}
