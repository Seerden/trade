/*  see https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date
    polygon response keys are not very descriptive. map them for ease of use */

export const aggregateResponseKeyMap = {
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

/*  since aggregateResponseKeyMap doesn't contain any complex-typed fields, 
    we can use Object.assign to create an acceptable 'deep' copy  */
export const snapshotResponseKeyMap = Object.assign(
    { T: "ticker" },
    aggregateResponseKeyMap
);
