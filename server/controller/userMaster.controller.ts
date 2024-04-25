import { NextFunction, Request, Response } from "express";
import { UserMasterService } from "../services";
import { UserMasterValidation } from "../validations";
import { ChangePasswordDTO, CreateUserDTO, EditUserDTO, SearchUserDTO } from "../dto";
import { DuplicateRecord, NotExistHandler } from "../errorHandler";
import { Op } from "sequelize";
import { removeFile, saveFile } from "../utils/helper";
import { comparePassword } from "../utils/bcrypt.helper";
import { UserMaster } from "../models";

export default class UserMasterController {
	private service = new UserMasterService();
	private validation = new UserMasterValidation();

	public getAll = {
		validation: this.validation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchUserDTO(req.query), req.authUser.id);
			res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const userId: string = req.params["id"] as string;
			const userExist = await UserMaster.findByPk(userId);
			if (!userExist) {
				throw new NotExistHandler("User Not Found");
			}
			const data = await this.service.findOne({ id: userId });
			res.api.create(data);
		},
	};

	public create = {
		validation: this.validation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const userData = new CreateUserDTO(req.body);
			const emailExists = await this.service.findOne({ email: userData.email, is_deleted: false });
			if (emailExists && emailExists != null) {
				throw new DuplicateRecord("Email already Exists");
			}

			if (userData.mobile_number) {
				const mobileExists = await this.service.findOne({ mobile_number: userData.mobile_number, is_deleted: false });
				if (mobileExists && mobileExists != null) {
					throw new DuplicateRecord("Mobile already Exists");
				}
			}
			const data = await this.service.create(userData);
			res.api.create(data);
		},
	};

	public edit = {
		validation: this.validation.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const userData = new EditUserDTO(req.body);
			const userId: string = req.params["id"] as string;
			const userExist = await UserMaster.findByPk(userId);
			if (!userExist) {
				throw new NotExistHandler("User Not Found");
			}

			if (userData.email) {
				const emailExists = await this.service.findOne({ id: { [Op.not]: userId }, email: userData.email, is_deleted: false });
				if (emailExists && emailExists != null) {
					throw new DuplicateRecord("Email already Exists");
				}
			}

			if (userData.mobile_number) {
				const mobileExists = await this.service.findOne({ id: { [Op.not]: userId }, mobile_number: userData.mobile_number, is_deleted: false });
				if (mobileExists && mobileExists != null) {
					throw new DuplicateRecord("Mobile already Exists");
				}
			}
			const data = await this.service.edit(userId, userData);
			res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const userId: string = req.params["id"] as string;
			const userExist = await UserMaster.findByPk(userId);
			if (!userExist) {
				throw new NotExistHandler("User Not Found");
			}
			await this.service
				.delete(userId, req.authUser.id)
				.then(async (data) => {
					res.api.create({
						message: `User deleted`,
					});
				})
				.catch((error) => {
					res.api.serverError(error);
				});
		},
	};

	public changePassword = {
		validation: this.validation.changePassword,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const changePasswordData = new ChangePasswordDTO(req.body);
			const userId: string = req.authUser.id as string;
			const userData = await this.service.findOne({ id: userId }, true);

			if (userData == null) {
				throw new NotExistHandler("User Not Found", false);
			}
			await comparePassword(changePasswordData.oldPassword, userData.password)
				.then(async () => {
					await this.service
						.changePassword(userId, changePasswordData)
						.then(() => {
							return res.api.create({
								message: "Password Changed",
							});
						})
						.catch((error) => {
							return res.api.validationErrors(error);
						});
				})
				.catch(() => {
					return res.api.unauthorized({ message: "Old Password Doesn't matched" });
				});
		},
	};

	public toggleUserActive = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const userId: string = req.params["id"] as string;
			const userExist = await UserMaster.findByPk(userId);
			if (!userExist) {
				throw new NotExistHandler("User Not Found");
			}
			await this.service
				.toggleUserActive(userId, req.authUser.id)
				.then((flag) => {
					res.api.create({
						message: `User is ${flag?.is_active ? "Actived" : "Deactivated"}`,
					});
				})
				.catch((error) => {
					res.api.serverError(error);
				});
		},
	};
}
