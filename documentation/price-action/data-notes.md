There's some things to consider in the process of creating the database:

-   we start out with nothing, so we need to first populate the database with as much data as we can get our hands on:
    -   daily price action history going back as far as possible (10 years with yf), for as many tickers as we can find
    -   1-minute action for the past ~30 days, again for as many tickers as we can get our hands on
        -   might be worth curating an initial list of active tickers from our 10-year daily database: just see which (100 or so per day) stocks had the most volume on a given day
