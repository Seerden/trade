create or replace function set_ticker() 
returns trigger as 
$$
    declare
        ticker varchar(16);
    begin
        NEW.ticker = TG_ARGV[0]::varchar(16);
        return NEW;
    end;
$$ language PLPGSQL

