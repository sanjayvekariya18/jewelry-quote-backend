import { NextFunction, Request, Response } from "express";
import { CustomerDetailsService, EmailService, TokenService } from "../services";
import { CustomerDetailsValidation } from "../validations";
import { ChangePasswordDTO, CreateCustomerDetailsDTO, EditCustomerDetailsDTO, SearchCustomerDetailsDTO } from "../dto";
import { BadResponseHandler, DuplicateRecord, NotExistHandler, UnauthorizedUserHandler } from "../errorHandler";
import { CustomerDetails } from "../models";
import { NewAccessToken } from "../services/token.service";
import { comparePassword, hashPassword } from "../utils/bcrypt.helper";
import { Op } from "sequelize";
import { generateRandomDigitNumber, removeFile, saveFile } from "../utils/helper";
import randomstring from "randomstring";
import ValidationHandler from "../errorHandler/validation.error.handler";

export default class CustomerDetailsController {
	private service = new CustomerDetailsService();
	private validations = new CustomerDetailsValidation();
	private tokenServices = new TokenService();
	private emailService = new EmailService();

	private generateRandomUniqueNumber = async (country_code: string) => {
		let isUnique = false;
		let randomNumber;
		let counter = 1;

		while (!isUnique && counter != 100) {
			randomNumber = `${country_code}${generateRandomDigitNumber(8 - country_code.length)}`;
			const existingRecord = await CustomerDetails.findOne({ where: { login_id: randomNumber } });
			if (!existingRecord) {
				isUnique = true;
			}
			counter++;
		}
		return isUnique ? randomNumber : undefined;
	};

	public create = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customerData = new CreateCustomerDetailsDTO(req.body);

			const isValidToken = await this.service.reCaptchaAuth(req.body.token);

			if (!isValidToken) {
				return res.api.permissionDenied("Captcha not verified");
			}

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

			if (customerData.address_map_link) {
				if (!customerData.address_map_link.startsWith("https://www.google.com/maps/")) {
					throw new ValidationHandler(`Google Address Link is Not Valid`);
				}
			}

			const file: any = req.files;
			if (file) {
				if (file.customer_business_card) {
					let uploadedImg: any = await saveFile(file.customer_business_card, "customer_business_card");
					customerData.customer_business_card = uploadedImg.upload_path;
				}
			}

			return await this.service
				.create(customerData)
				.then(async (d1) => {
					const data: any = await this.service.findOne({ id: d1.id });

					this.emailService.sendThankYouForRegistration({}, d1.customer_email);
					this.emailService.sendRegistrationUpdateToAdmin(
						{
							company_name: customerData.company_name,
							customer_name: customerData.customer_name,
							customer_email: customerData.customer_email,
							country_code: customerData.country_code,
							mobile_number: customerData.mobile_number,
							createdAt: data?.createdAt,
						},
						d1.customer_email
					);
					return res.api.create({
						data,
						message: "Your are registered with us. Your Id and password will be sent to your mail id as Admin approves it.",
					});
				})
				.catch((error) => {
					throw new BadResponseHandler(error);
				});
		},
	};

	public login = {
		validation: this.validations.login,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let customer_credential = {
				email: req.body.email.toString().trim(),
				password: req.body.password.toString().trim(),
			};
			await CustomerDetails.findOne({
				where: { customer_email: customer_credential.email, is_deleted: false },
				raw: true,
			})
				.then(async (customerData) => {
					if (customerData && customerData != null) {
						if (customerData.customer_email != null && customerData.password != null) {
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
							throw new UnauthorizedUserHandler("Contact admin for Email and password");
						}
					} else {
						throw new UnauthorizedUserHandler("Invalid credential");
					}
				})
				.catch((error) => {
					throw error;
				});
		},
	};

	public generateLoginIdPassword = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customer_id: string = req.params["id"] as string;
			const customerCheck = await this.service.findOne({ id: customer_id });
			if (customerCheck == null) {
				throw new NotExistHandler("Customer Not Found");
			}
			// const login_id = await this.generateRandomUniqueNumber(customerCheck.country_code);
			// if (!login_id) {
			// 	throw new DuplicateRecord("Login Id already exists");
			// }

			const password = randomstring.generate(8);
			const hashedPassword = await hashPassword(password);

			await CustomerDetails.update({ password: hashedPassword, is_active: true }, { where: { id: customer_id } });
			await this.emailService
				.sendLoginIdPassword({ password, customer_name: customerCheck.customer_name }, customerCheck.customer_email)
				.then(() => {
					return res.api.create({ message: `Password is sent to customer's mail id` });
				})
				.catch((error) => {
					throw new BadResponseHandler(error);
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
			const customer_id: string = req.params["id"] as string;
			const data = await this.service.findOne({ id: customer_id });
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
			const customer_id: string = req.customer.id;
			const customerData = new EditCustomerDetailsDTO(req.body);

			// const errorMessage = [];
			// if (customerData.customer_email) {
			// 	const checkEmail = await this.service.findOne({
			// 		id: { [Op.not]: customer_id },
			// 		customer_email: customerData.customer_email,
			// 	});
			// 	if (checkEmail) {
			// 		errorMessage.push("Email");
			// 	}
			// }
			// if (customerData.mobile_number) {
			// 	const checkMobilenumber = await this.service.findOne({
			// 		id: { [Op.not]: customer_id },
			// 		mobile_number: customerData.mobile_number,
			// 	});
			// 	if (checkMobilenumber) {
			// 		errorMessage.push("MobileNumber");
			// 	}
			// }
			// if (errorMessage.length > 0) {
			// 	throw new DuplicateRecord(`${errorMessage.join(", ")} already exists`);
			// }

			// if (customerData.address_map_link) {
			// 	if (!customerData.address_map_link.startsWith("https://www.google.com/maps/")) {
			// 		throw new ValidationHandler(`Google Address Link is Not Valid`);
			// 	}
			// }

			const file: any = req.files;
			if (file) {
				const oldImgData = await this.service.findOne({ id: customer_id });
				if (file.customer_business_card) {
					oldImgData?.customer_business_card && (await removeFile(oldImgData.customer_business_card));
					let uploadedImg: any = await saveFile(file.customer_business_card, "customer_business_card");
					customerData.customer_business_card = uploadedImg.upload_path;
				}
			}
			const data = await this.service.edit(customer_id, customerData);
			return res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customer_id: string = req.params["id"] as string;
			const customerExist = await CustomerDetails.findByPk(customer_id);
			if (!customerExist) {
				throw new NotExistHandler("Customer Not Found");
			}
			await this.service
				.delete(customer_id)
				.then(async (data) => {
					return res.api.create({
						message: `Customer deleted`,
					});
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
		},
	};

	public changePassword = {
		validation: this.validations.changePassword,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const changePasswordData = new ChangePasswordDTO(req.body);
			const customer_id: string = req.customer.id as string;
			const customerData = await this.service.findOne({ id: customer_id }, true);

			if (customerData == null) {
				throw new NotExistHandler("User Not Found", false);
			}
			if (customerData.password == null) {
				throw new NotExistHandler("Contact Admin for Login Id and Password", false);
			}
			await comparePassword(changePasswordData.oldPassword, customerData.password)
				.then(async () => {
					await this.service
						.changePassword(customer_id, changePasswordData)
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
					return res.api.validationErrors({ message: "Old Password Doesn't matched" });
				});
		},
	};

	public toggleCustomerActive = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customer_id: string = req.params["id"] as string;
			const customerExist = await CustomerDetails.findByPk(customer_id);
			if (!customerExist) {
				throw new NotExistHandler("Customer Not Found");
			}
			await this.service
				.toggleCustomerActive(customer_id)
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
