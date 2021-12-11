import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
import { fetchPriceActionForTicker } from "../../price-action/lib/fetch-price-action/fetch-ticker-history";
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
/**
 * API endpoints to be used in development only
 */
export const devRouter = express.Router({ mergeParams: true });

devRouter.get("/ticker/:ticker", async (req, res) => {
    const { ticker } = req.params;
    try {
        const { chart } = await fetchPriceActionForTicker(
            ticker,
            "2021-12-10",
            "2021-12-11"
        );
        // res.json({ time: chart.result[0].timestamp.at(-1) });
        res.json({ chart });

        // const { open, close, volume, low, high } =
        //     chart.result[0].indicators.quote[0];
    } catch (error) {
        console.error(error);
    }
});
