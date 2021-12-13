/*
    We programmatically create any number of database tables, with table names like msft_1m, aapl_1m
    unfortunately, node_postgres (because of a postgres identity) does not allow parametrized queries
    for things like table names, so we can't do something simple like 
        {   text:
                `CREATE TABLE IF NOT EXISTS $1`,
            values: 
                ["msft_1m"]
        }

    We have a few options:
    - use a library like pg-promise, in which we can use syntax like $/msft_1m/$ inside a query (even 
        then, I'm not entirely sure if that works around the above-mentioned postgres limitation)
    - use template literals ONLY inside this one query type and ensure we cast the template literals 
        to strings that only include /\W/ characters
    - pre-create every single table outside of this application. this leaves us with thousands of empty tables,
        so doesn't seem very efficient
*/

export function UNSAFE_sanitize(str: string) {
    return str.replace(/\W/g, "");
}
