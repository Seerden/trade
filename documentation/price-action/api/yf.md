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
