import { makePooledQueries, makePooledQuery } from "../pool/query-functions";

/**
 * Drop all currently existent ticker tables
 */
export async function DEV_dropTickerTables() {
    try {
        // get all ticker table names
        const tableNames = await makePooledQuery<{ tablename: string }[]>({
            name: "select ticker tables",
            text: `
                select tablename from pg_tables where 
                    tablename like '%1m'
                    or tablename like '%1h'
                    or tablename like '%1d';
            `,
        });

        // filter and map tableNames to a simple list of strings
        const tickerTableNames = tableNames
            .filter(({ tablename }) => !tablename.includes("price_action"))
            .map(({ tablename }) => tablename);

        // drop all ticker tables
        await makePooledQueries(
            tickerTableNames.map((tablename) => ({
                text: `drop table ${tablename};`,
            }))
        );

        // @todo - also remove all the dropped tables from redis ticker-tables:${timescale}
        return tickerTableNames;
    } catch (error) {
        console.error(error);
    }
}
