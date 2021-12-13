create index on price_action_1m using brin(ticker, timestamp);
create index on price_action_1m (ticker);

create index on price_action_1h using brin(ticker, timestamp);
create index on price_action_1h (ticker);

create index on price_action_1d using brin(ticker, timestamp);
create index on price_action_1d (ticker);