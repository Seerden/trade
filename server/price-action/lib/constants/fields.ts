import { PriceActionRow } from "types/database.types";

export const priceActionFieldsString =
	"ticker, timestamp, open, close, high, low, volume";
export const priceActionFields = priceActionFieldsString.split(", ") as Array<
	keyof PriceActionRow
>;
