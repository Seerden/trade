-   To allow for the most efficient indexing, create a separate table for each ticker. These 1-ticker tables all have the same schema, and we might want to query any number of them simultaneously for some purposes, so `inheritance` comes in handy here.

-   Create a `price_action` table. Each ticker's table then inherits from this table. Then, we can query tickers on an invididual bases extremely quickly, or give up a small bit of performance to query any number of tickers at the same time.

## Price action

We create a general `price_action` table, and let any subsequently created `ticker` tables inherit from this

```sql
create table price_action (
    timestamp   timestamptz     not null unique primary key
    open        numeric(6,6)    not null
    high        numeric(6,6)    not null
    low         numeric(6,6)    not null
    close       numeric(6,6)    not null
    volume      integer         not null
);

create index idx_timestamp on price_action using brin(timestamp);
```

For subsequent ticker tables, do the following (dynamically, since we can't know ahead of time which ticker we're creating a table for)

```sql
create table if not exists TICKER (
    ticker varchar(10) not null
)
```
