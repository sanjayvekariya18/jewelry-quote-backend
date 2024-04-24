import { NextFunction, Request, Response } from "express";
import { CustomerDetailsService, TokenService } from "../services";
import { CustomerDetailsValidation } from "../validations";
import { ChangePasswordDTO, CreateCustomerDetailsDTO, EditCustomerDetailsDTO, SearchCustomerDetailsDTO } from "../dto";
import { DuplicateRecord, NotExistHandler, UnauthorizedUserHandler } from "../errorHandler";
import { CustomerDetails } from "../models";
import { NewAccessToken } from "../services/token.service";
import { comparePassword } from "../utils/bcrypt.helper";
import { Op } from "sequelize";
import { removeFile, saveFile } from "../utils/helper";

export default class CustomerDetailsController {
	private service = new CustomerDetailsService();
	private validations = new CustomerDetailsValidation();
	private tokenServices = new TokenService();

	public create = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customerData = new CreateCustomerDetailsDTO(req.body);

			const errorMessage = [];
			const checkEmail = await this.service.findOne({
				customer_email: customerData.customer_email,
			});
			if (checkEmail) errorMessage.push("Email");

			const checkMobilenumber = await this.service.findOne({
				mobile_number: customerData.mobile_number,
			});
			if (checkMobilenumber) errorMessage.push("MobileNumber");

			if (errorMessage.length > 0) {
				throw new DuplicateRecord(`${errorMessage.join(", ")} already exists`);
			}

			const file: any = req.files;
			if (file) {
				if (file.customer_business_card) {
					let uploadedImg: any = await saveFile(file.customer_business_card, "customer_business_card");
					customerData.customer_business_card = uploadedImg.upload_path;
				}
			}

			const data = await this.service.create(customerData);
			if (data != null) {
				const tokenPayload = {
					id: data.id,
					customer_name: data.customer_name,
					customer_email: data.customer_email,
					mobile_number: data.mobile_number,
				};
				await this.tokenServices
					.generateCustomerAccessToken(tokenPayload)
					.then(async (tokenInfo: NewAccessToken) => {
						return res.api.create({
							token: tokenInfo.token,
							customer: tokenPayload,
							message: "Registration Completed",
						});
					})
					.catch((error) => {
						throw error;
					});
			}
		},
	};

	public login = {
		validation: this.validations.login,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let customer_credential = {
				customer_email: req.body.customer_email.toString().trim(),
				password: req.body.password.toString().trim(),
			};
			await CustomerDetails.findOne({
				where: { customer_email: customer_credential.customer_email },
				raw: true,
			})
				.then(async (customerData) => {
					if (customerData && customerData != null) {
						if (customerData.is_active == false) {
							throw new UnauthorizedUserHandler("You are deactivated. Contact admin");
						}
						await comparePassword(req.body.password.trim(), customerData.password)
							.then(async () => {
								const tokenPayload = {
									id: customerData.id,
									customer_name: customerData.customer_name,
									customer_email: customerData.customer_email,
									mobile_number: customerData.mobile_number,
								};
								await this.tokenServices
									.generateCustomerAccessToken(tokenPayload)
									.then(async (tokenInfo: NewAccessToken) => {
										return res.api.create({
											token: tokenInfo.token,
											customer: tokenPayload,
										});
									})
									.catch((error) => {
										throw error;
									});
							})
							.catch(() => {
								throw new UnauthorizedUserHandler("Invalid credential");
							});
					} else {
						throw new UnauthorizedUserHandler("Invalid credential");
					}
				})
				.catch((error) => {
					throw error;
				});
		},
	};

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchCustomerDetailsDTO(req.query));
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customerId: string = req.params["id"] as string;
			const data = await this.service.findOne({ id: customerId });
			if (data == null) {
				throw new NotExistHandler("Customer Not Found");
			}
			return res.api.create(data);
		},
	};

	public getProfileDetails = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customer_id = req.customer.id;
			const data = await this.service.findOne({ id: customer_id });
			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.validations.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customerId: string = req.customer.id;
			const customerData = new EditCustomerDetailsDTO(req.body);

			const errorMessage = [];
			if (customerData.customer_email) {
				const checkEmail = await this.service.findOne({
					id: { [Op.not]: customerId },
					customer_email: customerData.customer_email,
				});
				if (checkEmail) {
					errorMessage.push("Email");
				}
			}
			if (customerData.mobile_number) {
				const checkMobilenumber = await this.service.findOne({
					id: { [Op.not]: customerId },
					mobile_number: customerData.mobile_number,
				});
				if (checkMobilenumber) {
					errorMessage.push("MobileNumber");
				}
			}
			if (errorMessage.length > 0) {
				throw new DuplicateRecord(`${errorMessage.join(", ")} already exists`);
			}
			const file: any = req.files;
			if (file) {
				const oldImgData = await this.service.findOne({ id: customerId });
				if (file.customer_business_card) {
					oldImgData?.customer_business_card && (await removeFile(oldImgData.customer_business_card));
					let uploadedImg: any = await saveFile(file.customer_business_card, "customer_business_card");
					customerData.customer_business_card = uploadedImg.upload_path;
				}
			}
			const data = await this.service.edit(customerId, customerData);
			return res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customerId: string = req.params["id"] as string;
			const customerExist = await CustomerDetails.findByPk(customerId);
			if (!customerExist) {
				throw new NotExistHandler("Customer Not Found");
			}
			await this.service
				.delete(customerId)
				.then(async (data) => {
					res.api.create({
						message: `Customer deleted`,
					});
				})
				.catch((error) => {
					res.api.serverError(error);
				});
		},
	};

	public changePassword = {
		validation: this.validations.changePassword,
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
			const customerId: string = req.params["id"] as string;
			const customerExist = await CustomerDetails.findByPk(customerId);
			if (!customerExist) {
				throw new NotExistHandler("Customer Not Found");
			}
			await this.service
				.toggleUserActive(customerId)
				.then((flag) => {
					res.api.create({
						message: `Customer is ${flag?.is_active ? "Actived" : "Deactivated"}`,
					});
				})
				.catch((error) => {
					res.api.serverError(error);
				});
		},
	};
}