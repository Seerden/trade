-- create trades table
create table trades (
    user_id     serial          not null    references users(user_id),
    trade_id    serial          not null    primary key,
    ticker      varchar(16)     not null,
    trade_type  text            not null  -- 'long' or 'short', but as an enum (0, 1 or something similar)
);

-- create indexes
create index on trades(user_id, ticker);
create index on trades(user_id, trade_type);