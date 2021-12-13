create table price_action_1m (
    ticker      varchar(6)          not null,
    timestamp   numeric(16)         not null,
    open        numeric(16,6)       not null,
    high        numeric(16,6)       not null,
    low         numeric(16,6)       not null,
    close       numeric(16,6)       not null,
    volume      integer             not null,
    primary key(ticker, timestamp)
);

create table price_action_1h (like price_action_1m including all);
create table price_action_1d (like price_action_1m including all);