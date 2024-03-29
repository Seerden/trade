/**
 * @see: https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date
 * Polygon response keys (see link above) are not very descriptive, so let's map them for ease of use
 */

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

export const snapshotResponseKeyMap = {
	T: "ticker",
	...aggregateResponseKeyMap,
};
