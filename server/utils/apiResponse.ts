import { Response } from "express";
import httpStatus from "http-status";
import { logInfo } from "./helper";

interface ResponseFormat {
	data: any;
	error: any;
	status: number;
	success: boolean;
}

export default class ApiResponse {
	public response: Response;
	public returnData: ResponseFormat;

	constructor(res: Response) {
		this.response = res;
		this.returnData = {
			data: null,
			error: null,
			status: 200,
			success: true,
		};
	}

	public create(data: any) {
		this.returnData.data = data;
		this.response.status(httpStatus.OK).json(this.returnData);
	}

	public __create(message: string) {
		this.create({
			message,
		});
	}

	public serverError(error: any) {
		this.error(httpStatus.INTERNAL_SERVER_ERROR, error);
		this.response.status(this.returnData.status).json(this.returnData);
	}

	public badResponse(error: any) {
		this.error(httpStatus.BAD_REQUEST, error);
		this.response.status(this.returnData.status).json(this.returnData);
	}

	public validationErrors(error: any) {
		this.error(httpStatus.UNPROCESSABLE_ENTITY, error);
		this.response.status(this.returnData.status).json(this.returnData);
	}

	public unauthorized(error: any) {
		this.error(httpStatus.UNAUTHORIZED, error);
		this.response.status(this.returnData.status).json(this.returnData);
	}

	public permissionDenied(error: any) {
		this.error(httpStatus.FORBIDDEN, error);
		this.response.status(this.returnData.status).json(this.returnData);
	}

	public noPermission(error: any) {
		this.error(httpStatus.FORBIDDEN, error);
		this.response.status(this.returnData.status).json(this.returnData);
	}

	public noContent(error: any) {
		this.error(httpStatus.NO_CONTENT, error);
		this.response.status(this.returnData.status).json(this.returnData);
	}

	public notFound(error: any) {
		this.error(httpStatus.NOT_FOUND, error);
		this.response.status(this.returnData.status).json(this.returnData);
	}

	public duplicateRecord(error: any) {
		this.error(httpStatus.CONFLICT, error);
		this.response.status(this.returnData.status).json(this.returnData);
	}

	private async error(code: number, error: any) {
		this.returnData.success = false;
		this.returnData.status = code;
		this.returnData.error = error;

		await logInfo({
			data: error,
			type: "error",
		});
	}
}
