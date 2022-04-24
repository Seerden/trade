import { OHLC } from "../types/ohlc.types";

/** Use a fields variable for these so that we know they're always in the right order. */
export const aggregateFieldsString =
	"ticker, timestamp, open, close, high, low, volume";
export const aggregateFields = aggregateFieldsString.split(", ") as Array<OHLC>;
