import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
import { fetchAndInsertAggregate } from "../../price-action/lib/polygon/requests/aggregate/aggregate-insert";
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

devRouter.get("/:ticker/1m/:from/:to/", async (req, res) => {
    const { ticker, from, to } = req.params;

    res.json({
        timestampsInserted: await fetchAndInsertAggregate({
            timespan: "minute",
            from,
            to,
            ticker: ticker.toUpperCase(),
        }),
    });
});
