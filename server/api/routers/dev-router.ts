import express from "express";
import { fetchPriceActionForTicker } from "../../price-action/lib/fetch-ticker-history";

/**
 * API endpoints to be used in development only
 */
export const devRouter = express.Router({ mergeParams: true });

devRouter.get("/ticker/:ticker", async (req, res) => {
    const { ticker } = req.params;
    try {
        const { chart } = await fetchPriceActionForTicker(
            ticker,
            "2021-12-08",
            "2021-12-09"
        );
        res.json({ time: chart.result[0].timestamp.at(-1) });

        // const { open, close, volume, low, high } =
        //     chart.result[0].indicators.quote[0];
    } catch (error) {
        console.error(error);
    }
});
