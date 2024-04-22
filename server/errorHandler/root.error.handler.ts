import { NextFunction, Request, Response } from "express";
import {
	NotExistHandler,
	TokenExpiredUserHandler,
	UnauthorizedUserHandler,
	BadResponseHandler,
	FormErrorsHandler,
	DuplicateRecord,
	NoContent,
	PermissionDeniedHandler,
} from ".";
import ApiResponse from "../utils/apiResponse";
import config from "../config/config";
import { NODE_MODE } from "../constants";
import ValidationHandler from "./validation.error.handler";

const RootErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	let returnResponse: any = {
		message: err.message,
	};

	if (config.env == NODE_MODE.DEVELOPMENT && err.stack) {
		returnResponse = { ...returnResponse, dev_error: err.stack.split("\n")[1] };
	}

	if (err instanceof NotExistHandler) {
		return res.api[err.success ? "create" : "badResponse"](returnResponse);
	} else if (err instanceof UnauthorizedUserHandler || err instanceof TokenExpiredUserHandler) {
		return res.api.unauthorized(returnResponse);
	} else if (err instanceof BadResponseHandler) {
		return res.api.badResponse(returnResponse);
	} else if (err instanceof FormErrorsHandler) {
		return res.api.validationErrors(err.errors);
	} else if (err instanceof DuplicateRecord) {
		return res.api.duplicateRecord(returnResponse);
	} else if (err instanceof NoContent) {
		return res.api.noContent(returnResponse);
	} else if (err instanceof ValidationHandler) {
		return res.api.validationErrors(returnResponse);
	} else if (err instanceof PermissionDeniedHandler) {
		return res.api.permissionDenied(returnResponse);
	}

	if (res.api instanceof ApiResponse) {
		return res.api.serverError(returnResponse);
	}
	return res.status(500).json(returnResponse);
};

export default RootErrorHandler;
