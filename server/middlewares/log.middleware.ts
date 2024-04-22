import { Application, NextFunction, Request, Response } from "express";
import { logInfo } from "../utils/helper";

export default (app: Application) => {
	app.use("*", async (req: Request, res: Response, next: NextFunction) => {
		let data: any = {
			request: {
				body: req.body,
				query: req.query,
			},
			url: req.protocol + "://" + req.get("host") + req.originalUrl,
			method: req.method,
		};
		await logInfo({
			data: data,
			type: "request",
		});
		next();
	});
};
