Usually we'll have access to timestamps, but for quick CLI queries, we can cast
timestamps (inserted into database as UNIX millisecond values) to dates using

```sql
to_timestamp(table_name.timestamp_column_name/1000)::date
```

which returns YYYY-MM-DD strings.
