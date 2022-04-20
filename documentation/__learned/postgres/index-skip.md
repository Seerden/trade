Postgres doesn't natively support skipping index scans.

If we have a query like `select distinct(ticker) from price_action_1m`, where we
expect few unique values, even though the table has many rows, the following
query is much (few orders of magnitude) faster than a simple `select distinct`:

```sql
WITH RECURSIVE cte AS (
   (SELECT ticker FROM price_action_1m ORDER BY ticker LIMIT 1)
   UNION ALL
   SELECT (SELECT ticker FROM price_action_1m
           WHERE  ticker > t.ticker ORDER BY ticker LIMIT 1)
   FROM   cte t
   WHERE  t.ticker IS NOT NULL
   )
SELECT count(ticker) FROM cte;
```
