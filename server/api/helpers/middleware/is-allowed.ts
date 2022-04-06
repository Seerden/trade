import { Request, Response } from "express";

export function isAllowed(req: Request, res: Response, next: (args?: any) => any) {
	if (process.env.NODE_ENV === "development") {
		return next();
	}

	// @ts-ignore
	if (!req.user?.username || !req.body?.username) {
		res.json({
			message:
				"Authenticated request, but at least one of req.user.username and req.body.username does not exist.",
		});
	}

	// @ts-ignore
	if (req.user.username === req.body.username) {
		next?.();
	} else {
		res.json({
			message:
				"User may only make a request for their own data; provided username does not match logged in user.",
		});
	}
}
