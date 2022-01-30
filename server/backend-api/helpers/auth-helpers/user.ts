// @todo

import { hash } from "bcrypt";
import { makePooledQuery } from "../../../price-action/database/pool/query-functions";

/**
 * Fetch user from database, by username
 */
export async function getUser(username: string) {
    return await makePooledQuery({
        text: "select (username, creation_date) from users where username = $1",
        values: [username],
    });
}

type NewUser = {
    username: string;
    password: string;
};

export async function createUser({ username, password }: NewUser) {
    const hashedPassword = await hash(password, 10);

    await makePooledQuery({
        text: "insert into users (username, password) values ($1, $2)",
        values: [username, hashedPassword],
    });
}
