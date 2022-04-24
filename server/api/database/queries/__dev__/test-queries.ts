import { API } from "../../../../database/pools/apis";

export async function testQuery() {
	const response = await API.query({
		text: "select * from users",
	});

	return response;
}

async function deleteUsers() {
	await API.query({
		text: "delete from users",
	});
}

async function deleteTrades() {
	await API.query({
		text: "delete from trades",
	});
}

async function deleteTickets() {
	await API.query({
		text: "delete from tickets",
	});
}

export async function deleteEntries() {
	await deleteUsers();
	await deleteTrades();
	await deleteTickets();
}
