-- create users table
create table users (
    user_id     serial      not null    unique,
    username    text        not null    unique  primary key,
    password    text        not null,
    created_at  timestamptz not null    default NOW()
);

-- create index on users.username
create index on users (username);

-- create trigger function to set created_at field
create or replace function trigger_set_created_at()
returns trigger as $$
begin
    NEW.created_at = NOW()::timestamptz;
    return NEW;
end;
$$ language plpgsql;

-- set trigger on table
create trigger set_created_at
before insert on users
for each row
execute procedure trigger_set_created_at();