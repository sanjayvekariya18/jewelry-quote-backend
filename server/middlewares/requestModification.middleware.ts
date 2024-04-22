import { NextFunction, Request, Response } from "express";

const RequestModification = (data: any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		data.forEach((element: any) => {
			if (typeof req.body[element] == "string") req.body[element] = JSON.parse(req.body[element]);
		});

		next();
	};
};

export default RequestModification;
