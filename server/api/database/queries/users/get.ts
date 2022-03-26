import { BackendApiObject as API } from "../../../../database/pools/query-objects";

export async function getUserId(username: string) {
    return await API.query({
        text: "select user_id from users where username = $1",
        values: [username],
    });
}
