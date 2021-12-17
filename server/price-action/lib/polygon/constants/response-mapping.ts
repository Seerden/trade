/*  see https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date
    polygon response keys are not very descriptive. map them for ease of use */

export const ohlcResponseKeyMap = {
    c: "close",
    h: "high",
    l: "low",
    n: "transactionCount",
    o: "open",
    t: "timestamp",
    v: "volume",
    vw: "vwap",
};

export const priceActionColumns = "close high low open timestamp volume".split(" ");
