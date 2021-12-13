import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import express from "express";
import { maybeCreateTickerTable } from "../../price-action/database/statements/create-ticker-table";
import { insertHistoricalOneMinuteAction } from "../../price-action/database/statements/insert-1m-data";
import { insertTenYearDailyPriceAction } from "../../price-action/database/statements/insert-ten-year-data";
import {
    fetchDailyPriceAction,
    fetchFlatDailyAction,
} from "../../price-action/database/statements/price-action-query";
import { DEV_dropTickerTables } from "../../price-action/database/_dev/drop-ticker-tables";
import { initManyOneMinute } from "../../price-action/database/_dev/historical-1m/store-many-1m";
import { makeTickerArray } from "../../price-action/database/_dev/tickers/make-tickers-array";
import { fetchPriceActionForTicker } from "../../price-action/lib/fetch-price-action/fetch-ticker-history";
import { Timescale } from "../../types/store.types";
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

// devRouter.get("/daily/:ticker", async (req, res) => {
//     const { ticker } = req.params;
//     const data = await fetchTenYearDailyPriceAction(ticker);
//     res.json({ data });
// });

devRouter.post("/table/:ticker/:timescale", async (req, res) => {
    const { ticker, timescale } = req.params;
    console.log(req.params);
    try {
        const response = await maybeCreateTickerTable(ticker, timescale as Timescale);
        res.json({ response });
    } catch (error) {
        console.error(error);
    }
});

devRouter.post("/table/drop", async (req, res) => {
    res.json({ droppedTables: await DEV_dropTickerTables() });
});

// devRouter.post("/10-year-init", async (req, res) => {
//     try {
//         const tickersInserted = await insertManyTenYearDaily(tickerList);
//         res.json({ tickersInserted });
//     } catch (error) {
//         console.error(error);
//         res.status(401).json({ error: "Failed to insert tickers" });
//     }
// });

devRouter.post("/10-year/:ticker", async (req, res) => {
    const { ticker } = req.params;
    const insertedRows = await insertTenYearDailyPriceAction(ticker);

    res.json({ insertedRows });
});

devRouter.get("/1d/:ticker", async (req, res) => {
    const { ticker } = req.params;
    const { flat } = req.query;

    try {
        if (flat === "true") {
            res.json({ data: await fetchFlatDailyAction(ticker) });
        } else {
            res.json({ data: await fetchDailyPriceAction(ticker) });
        }
    } catch (error) {
        res.status(401).json({ error: "Error occured while querying database" });
    }
});

devRouter.get("/tickers", async (req, res) => {
    res.json({ tickerList: await makeTickerArray() });
});

devRouter.post("/1m/:ticker", async (req, res) => {
    const { ticker } = req.params;
    try {
        await insertHistoricalOneMinuteAction(ticker, "2021 Nov 14", "2021 Nov 19");
        res.json({ message: "Successfully inserted rows" });
    } catch (error) {
        console.error(error);
        res.json({ message: "Error inserting rows", error });
    }
});

devRouter.post("/init/1m", async (req, res) => {
    await initManyOneMinute();
});
