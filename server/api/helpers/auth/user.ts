import { hash } from "bcrypt";
import { BackendApiObject as API } from "../../../database/pools/query-objects";

/**
 * Fetch user from database, by username
 */
export async function getUser(username: string) {
    return await API.query({
        text: "select username, created_at, password from users where username = $1",
        values: [username],
    });
}

type NewUser = {
    username: string;
    password: string;
};

export async function createUser({ username, password }: NewUser) {
    const hashedPassword = await hash(password, 10);

    return await API.query({
        text: `
            insert into users (username, password) values ($1, $2) 
            returning (username, user_id, created_at)
        `,
        values: [username, hashedPassword],
    });
}
