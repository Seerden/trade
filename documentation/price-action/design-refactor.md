## Initial:

My initial thought was to use separate tables for each ticker and timestamp, e.g. "cei_1d", "cei_1m", ... However, this is a headache to work with in many realistic use-cases (like querying for a bunch of different tickers simultaneously). So, instead, use one table per timescale and make the table as efficient as possible through indexes, clustering, partitioning, and/or whatever else we need to do.

## Redesign:

Use three tables to store price action data:

-   1m
-   1h
-   1d

Shape of the three is identical:

```sql
{
    timestamp,
    open,
    close,
    high,
    low,
    volume
    primary key (ticker, timestamp)
}
```

-   indexes (use brin):
    -   (ticker, timestamp)
    -   (ticker)
    -   (timestamp)
-   constraints:

    -   unique(ticker, timestamp)

-   queries:

    -   inserts:
        -   on conflict do nothing: only conflict should be unique(ticker, timestamp), and data from the API should never change, so there's no reason to overwrite existing results

-   caching:

    -   date ranges:

        -   it's handy to be able to find out which dates are present in database without having to query for them in the database.

            -   efficiently accomplish this by storing every fetched date range in redis
            -   since we only fetch data after trading sessions end (i.e. we fetch full days only), we can use dates
                -   parse to string before inputting, and store as (start,end), i.e. "20211010,20211011"
            -   example key/value pair:

                    key: 1d-ranges:cei
                    value: ["20211010,20211015", "20211016,20211021"]

                note that we assume that yf api works in such a way that including a date as an endpoint means we _do_ receive data
                for that date in the request (i.e. we assume an range).
