import { Application, NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/apiResponse";

export default (app: Application) => {
	app.use("*", (req: Request, res: Response, next: NextFunction) => {
		res.api = new ApiResponse(res);
		next();
	});
};
