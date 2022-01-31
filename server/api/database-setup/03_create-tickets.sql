-- create tickets table
create table tickets (
    user_id     serial          not null    references users(user_id),
    trade_id    serial          not null    references trades(trade_id),
    ticket_id   serial          not null    unique      primary key,
    ticker      varchar(10)     not null,
    timestamp   numeric(16)     not null,
    action      text            not null,
    quantity    numeric         not null,
    price       numeric(16,6)   not null
);

-- create indexes
create index on tickets(user_id);
create index on tickets(user_id, ticker);

