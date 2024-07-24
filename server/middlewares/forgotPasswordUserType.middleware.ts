import { NextFunction, Request, Response } from "express";
import { FORGOT_PASSWORD_USER_TYPE } from "../enum";

const forgotPasswordUserType = (user_type: FORGOT_PASSWORD_USER_TYPE) => {
	return (req: Request, res: Response, next: NextFunction) => {
		req.body.user_type = user_type;
		return next();
	};
};

export default forgotPasswordUserType;
