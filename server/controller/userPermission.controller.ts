import { NextFunction, Request, Response } from "express";
import { UserMasterService, UserPermissionsService } from "../services";
import { UserPermissionsDTO, ToggleUserPermissionDTO } from "../dto";
import { UserPermissionValidations } from "../validations";
import { NotExistHandler } from "../errorHandler";
import { UserMaster, UserPermissions } from "../models";

export default class UserPermissionController {
	private userPermissionService = new UserPermissionsService();
	private userMasterService = new UserMasterService();
	private userPermissionValidations = new UserPermissionValidations();

	public getAll = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const user_id: string = req.params["id"] as string;
			const userExist = await UserMaster.findByPk(user_id);
			if (!userExist) {
				throw new NotExistHandler("User Not Found");
			}
			const data = await this.userPermissionService.getAll(user_id);
			return res.api.create(data);
		},
	};

	public permissionsNotAssigned = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const user_id: string = req.params["id"] as string;
			const userExist = await UserMaster.findByPk(user_id);
			if (!userExist) {
				throw new NotExistHandler("User Not Found");
			}
			const data = await this.userPermissionService.permissionsNotAssigned(user_id);
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.userPermissionValidations.UserPermission,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const permissionData = new UserPermissionsDTO(req.body);
			const userData = await this.userMasterService.findOne({ id: permissionData.user_id });
			if (!userData && userData == null) {
				throw new NotExistHandler("User Not Found", false);
			}

			const data = await this.userPermissionService.create(permissionData);
			return res.api.create(data);
		},
	};

	public toggleUserPermission = {
		validation: this.userPermissionValidations.ToggleUserPermission,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const permissionData = new ToggleUserPermissionDTO(req.body);
			const userPermissionId: string = req.params["id"] as string;
			const userPermissionExist = await UserPermissions.findByPk(userPermissionId);
			if (!userPermissionExist) {
				throw new NotExistHandler("User Permission Not Found");
			}
			return await this.userPermissionService
				.toggleUserPermission(userPermissionId, permissionData)
				.then(() => {
					return res.api.create({
						message: `Permission Updated`,
					});
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const userPermissionId: string = req.params["id"] as string;
			const userPermissionExist = await UserPermissions.findByPk(userPermissionId);
			if (!userPermissionExist) {
				throw new NotExistHandler("User Permission Not Found");
			}
			await this.userPermissionService
				.delete(userPermissionId)
				.then(() => {
					return res.api.create({
						message: `User Permission deleted`,
					});
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
		},
	};
}
