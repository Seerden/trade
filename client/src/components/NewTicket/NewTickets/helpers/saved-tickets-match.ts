import { NewTicket } from "types/ticket.types";
import { SavedTicket } from "../useNewTickets";

/**
 * Determine whether `newTicket` was saved by checking if it exists in `savedTickets`
 */
export function isSavedTicket(
	newTicket: NewTicket,
	savedTickets: SavedTicket[]
) {
	if (!savedTickets?.length) return false;

	/**
	 * TODO: The following method is an O(m*n) solution because for every newTicket, we
	 * could end up checking every savecTicket
	 * A way more performant solution would be to serialize each newTicket (and
	 * savedTicket) to a string, and then to a substring includes check.
	 * Of course, realistic use-cases only involve a few tickets at a time, so
	 * this is a functionally irrelevant improvement.
	 */
	for (const savedTicket of savedTickets) {
		const fields = "action price quantity timestamp ticker".split(" ") as Array<
			keyof NewTicket & SavedTicket
		>;
		if (
			fields.every(
				(field) =>
					savedTicket[field] !== undefined &&
					newTicket[field] !== undefined &&
					// Only use double equals operator so that JS handles the type
					// coercion of certain fields, like timestamp, which is a string
					// in SavedTicket, but a number in NewTicket.
					savedTicket[field] == newTicket[field]
			)
		) {
			return true;
		}
	}

	return false;
}
