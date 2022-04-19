# Trade
Stock trading review application - charts and trading lookup and performance review

# This README
I'm currently going through rapid iteration to work towards a minimum viable product, so this README will remain a little light for a short while, while I get the project up and running. 

There's pretty much not a single page or component that's in a viable state right now. Give me a week or two from this date and I'll have more to show. 😅

# Run locally
Create two .env files (I'm not entirely sure if we actually need to, so feel free to play around..)
- `./_containers/.env`
- `./server/.env`

Here's what they should contain:
```
SESSION_SECRET=
POLYGON_KEY=

# variables for the `database` service

POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
DB_HOST=

# variables for `api_database` service

API_DB_HOST=
PG_API_USER=
PG_API_PASS=
PG_API_DB=

SENTRY_DSN=

```

- `SESSION_SECRET`, `POLYGON_KEY` and `SENTRY_DSN` are only necessary for `./server.env`. 
- There are some npm scripts in the root directory of this project that only run if certain values are given certain names (see for example `npm run db` and `npm run db_pa`). If you want to run these scripts, make sure to either use those values in your process.env, or adjust the values in the npm scripts to match those you assign in your environment.

There is a .env file in the client also, which should contain a `SENTRY_DSN`. 

- If you want to run Sentry in the project, make sure to set up Sentry projects by yourself. 
  - TODO: don't try to initialize sentry or use Sentry functionality if Sentry isn't initialized (or doesn't have a proper DSN, etc.)

Once your environment is set up properly, just run `npm run dev` to start up all containers.
