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
