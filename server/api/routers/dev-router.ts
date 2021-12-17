import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
import { fetchPriceActionForTicker } from "../../price-action/database/queries/fetch-price-action";
import { fetchMaxOneMinuteData } from "../../price-action/database/_dev/polygon/max-1m-query";
import { fetchDailyOHLC } from "../../price-action/lib/polygon/requests/market-snapshot";
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * API endpoints to be used in development only
 */
export const devRouter = express.Router({ mergeParams: true });

devRouter.get("/daily/all", async (req, res) => {
    const response = await fetchDailyOHLC({ date: "2021-12-13" });
    res.json({ response });
});

devRouter.post("/:ticker/1m/:to", async (req, res) => {
    const { ticker, to } = req.params;

    await fetchMaxOneMinuteData({
        ticker,
        to,
    });
});

devRouter.get("/:ticker/1m/:from/:to", async (req, res) => {
    const { ticker, from, to } = req.params;
    const { limit } = req.query;

    const rows = await fetchPriceActionForTicker({
        timescale: "minute",
        ticker: ticker.toUpperCase(),
        from,
        to,
        limit: limit ? String(limit) : null,
    });

    res.json({ rows });
});
