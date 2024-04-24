import { NextFunction, Request, Response } from "express";
import { PermissionDeniedHandler } from "../errorHandler";
import { PermissionDetails } from "../services/authorization.service";
import { PERMISSIONS } from "../enum";

const UserPermissionsCheck = (permission: PERMISSIONS) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (req.url == "/login") {
			return next();
		}

		const permissionData: PermissionDetails | undefined = req.authUser.permissions.find((data) => data.name == permission);
		if (permissionData) {
			if (permissionData.name == permission && permissionData[REQ_METHOD[req.method] as keyof PermissionDetails]) {
				return next();
			}
		}

		throw new PermissionDeniedHandler("You don't have rights");
	};
};

interface REQ_METHOD_OBJECT {
	[key: string]: string;
}

const REQ_METHOD: REQ_METHOD_OBJECT = {
	GET: "view",
	POST: "create",
	PUT: "edit",
	DELETE: "delete",
};

export default UserPermissionsCheck;
