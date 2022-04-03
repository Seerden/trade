import { Request, Response } from "express";

export function logRequests(req: Request, res: Response, next: (...args: any) => any) {
	const { method, url, body, query } = req;
	console.log({
		method,
		url,
		body,
		query,
	});
	next();
}
