create table price_action (
    timestamp   timestamptz     not null primary key,
    open        numeric(6,6)    not null,
    high        numeric(6,6)    not null,
    low         numeric(6,6)    not null,
    close       numeric(6,6)    not null,
    volume      integer         not null
);