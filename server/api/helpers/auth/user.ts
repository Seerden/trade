import { hash } from "bcrypt";
import { API } from "../../../database/pools/apis";

/**
 * Fetch user from database, by username
 */
export async function getUser(username: string) {
	return await API.query({
		text: "select username, created_at, password, user_id from users where username = $1",
		values: [username],
	});
}

type NewUser = {
	username: string;
	password: string;
};

export async function createUser({ username, password }: NewUser) {
	const hashedPassword = await hash(password, 10);

	// TODO: what happens if we try to insert a user with a username that's
	// already taken?
	return await API.query({
		text: `
            insert into users (username, password) values ($1, $2) 
            returning username, user_id, created_at
        `,
		values: [username, hashedPassword],
	});
}
