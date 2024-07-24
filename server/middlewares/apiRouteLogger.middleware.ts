import { Application, NextFunction, Request, Response } from "express";
import { config, logger } from "../config";
import moment from "moment";

export default (app: Application) => {
	app.use("*", async (req: Request, res: Response, next: NextFunction) => {
		if (config.env == "development") {
			const ip = req.ip?.split(":")[req.ip?.split(":").length - 1] || "";
			logger.info(
				`User >> ${ip} | Time >> ${moment().format("YYYY-MM-DD HH:mm:ss")} | METHOD >> ${req.method} | ${req.protocol}://${req.get("host")}${
					req.originalUrl
				}`
			);
		}
		if (req.body) {
			req.body = trimStrings({ ...req.body });
		}
		if (req.query) {
			req.query = trimStrings(req.query);
		}
		if (req.params) {
			req.params = trimStrings(req.params);
		}
		next();
	});
};

function trimStrings(obj: any): any {
	if (typeof obj === "string") {
		return obj.trim();
	}

	if (Array.isArray(obj)) {
		return obj.map(trimStrings);
	}

	if (typeof obj === "object" && obj !== null) {
		const trimmedObj: any = {};
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				trimmedObj[key] = trimStrings(obj[key]);
			}
		}
		return trimmedObj;
	}

	return obj;
}
