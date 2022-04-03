import { BackendApiObject as API } from "../../../../database/pools/query-objects";
import { User } from "../../../../types/database.types";
import { Maybe } from "../../../../types/global";

/**
 * TODO: the users table is simple enough that it might be better to, for now,
 * have one fetchUser() transaction function, and then a few helpers to extract
 * only the things we need, instead of separate transactions like getUsername(), getUserId()
 */

export async function getUserId(username: string) {
	const [response] = (await API.query({
		text: "select user_id from users where username = $1",
		values: [username],
	})) as [Maybe<User>];

	return response?.user_id ?? null;
}
