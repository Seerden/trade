import { BackendApiObject as API } from "../../../../database/pools/query-objects";

/**
 * TODO: the users table is simple enough that it might be better to, for now,
 * have one fetchUser() transaction function, and then a few helpers to extract
 * only the things we need, instead of separate transactions like getUsername(), getUserId()
 */

export async function getUserId(username: string) {
	const [response] = await API.query({
		text: "select (u.user_id) from users u where username = $1",
		values: [username],
	});

	return response?.user_id;
}
