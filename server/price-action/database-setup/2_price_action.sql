create table price_action_1m (
    ticker      varchar(16)     not null,
    timestamp   numeric(16)     not null primary key,
    open        numeric(12,6)    not null,
    high        numeric(12,6)    not null,
    low         numeric(12,6)    not null,
    close       numeric(12,6)    not null,
    volume      integer         not null
);

create table price_action_1h (like price_action_1m including all);
create table price_action_1d (like price_action_1m including all);