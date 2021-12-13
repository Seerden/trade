create index on price_action_1d using brin(ticker, timestamp);
create index price_action_1d_ticker on price_action_1d (ticker);