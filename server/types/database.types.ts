// prices are stored as floats in database -- check whether we receive them as string or as number
type PriceType = string | number;

export type PriceActionRow = {
	ticker: string;
	timestamp: number;
	volume: number;
	open: PriceType;
	high: PriceType;
	low: PriceType;
	close: PriceType;
};

export type Trade = {
	user_id: number;
	trade_id: number;
	ticker: string;
	trade_type: "long" | "short";
};

export type User = {
	user_id: number;
	username: string;
	password: string;
	created_at: string; // is it? or is it a date of some kind?
};
