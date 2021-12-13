## Quick overview of the yahoo finance API and the expected response types for the endpoints we use:

### Endpoint: `/v8/finance/chart/ticker`

-   Response:

    ```js
    {
        chart: {
            result: [
                {
                    meta: {
                        currency,
                        symbol,
                        exchangeName,
                        ...
                    },
                    timestamp: [
                        // array of UNIX-second timestamps
                    ],
                    indicators: {
                        quote: [
                            {
                                open: number[],
                                close: number[],
                                volume: int[], // pretty sure they don't track fractional shares
                                low: number[],
                                high: number[]
                            }
                        ]
                    }
                }
            ]
            error?: ...
        }

    }
    ```

-   Notes:
    -   will retrieve data starting from the actual specified `period1` param. If we specify midnight local time, it'll try to get data starting from that point. If markets closed, then, we do still get volume back. So use New York local time as endpoints just so we don't get overlapping or empty data.

### Possible data ranges:

-   if we set `interval` to `max`, we might end up only getting monthly data, which isn't particularly useful.
-   set `interval` to `10y` and then we can get daily price action, which is more useful.
-   1-minute price action only goes back 30 days or so.
    -   Note: "Only 7 days worth of 1m granularity data are allowed to be fetched per request".

### Query parameters:

-   To get data from a select date range, use params `{ period1, period2 }`, where each is a UNIX timestamp (in seconds).
    -   Note that we can query data until (i.e. exclusive of) period2, e.g. if we're on 1m granularity, and we specify `period2=1639404060`, then the last actual timestamp returned from the API is $1639404060-60 = 1639404000$
