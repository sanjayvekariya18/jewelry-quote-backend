import { NextFunction, Request, Response } from "express";
import { PermissionMasterService } from "../services";
import { CreatePermissionDTO, SearchPermissionDTO } from "../dto";
import { PermissionMasterValidation } from "../validations";
import { DuplicateRecord } from "../errorHandler";

export default class PermissionMasterController {
	private permissionMasterService = new PermissionMasterService();
	private permissionMasterValidation = new PermissionMasterValidation();

	public getAll = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.permissionMasterService.getAll(new SearchPermissionDTO(req.query));
			res.api.create(data);
		},
	};

	public create = {
		validation: this.permissionMasterValidation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const permissionData = new CreatePermissionDTO(req.body);
			const existPermission = await this.permissionMasterService.findOne({ permissionName: permissionData.permissionName });
			if (existPermission) {
				throw new DuplicateRecord("Permission Already exists");
			}
			const data = await this.permissionMasterService.create(permissionData);
			res.api.create(data);
		},
	};
}
