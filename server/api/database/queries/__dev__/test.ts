import { BackendApiObject } from "../../../../database/pools/query-objects";

export async function testQuery() {
	const response = await BackendApiObject.query({
		text: "select * from users",
	});

	return response;
}
