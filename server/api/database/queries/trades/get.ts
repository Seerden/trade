import { BackendApiObject as API } from "../../../../database/pools/query-objects";
import { NewTicket } from "../../../types/ticket.types";

// DO NOT DO IT LIKE THIS
export function getTradeIds(tickets: NewTicket[]): Array<number> {
    // return a list of tradeIds, one for each ticket in `tickets`
    return [];
}

type Options = {
    userId: string;
};
// fetch trades
export function getTradesByUser({ userId }: Options) {
    API.query({
        text: "select * from trades where user_id = $1",
        values: [userId],
    });
}
