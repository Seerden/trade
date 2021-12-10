-   To allow for the most efficient indexing, create a separate table for each ticker. These 1-ticker tables all have the same schema, and we might want to query any number of them simultaneously for some purposes, so `inheritance` comes in handy here.

-   Create a `price_action` table. Each ticker's table then inherits from this table. Then, we can query tickers on an invididual bases extremely quickly, or give up a small bit of performance to query any number of tickers at the same time.
