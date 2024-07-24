import { NextFunction, Request, Response } from "express";
import { isEmpty } from "../utils/helper";
import { config } from "../config";
import randomstring from "randomstring";
import moment from "moment";
import { CustomerDetails, ForgotPassword, UserMaster } from "../models";
import { FORGOT_PASSWORD_USER_TYPE, USER_TYPES } from "../enum";
import { CustomerDetailsService, EmailService, ForgotPasswordService, UserMasterService } from "../services";
import { ForgotPasswordDTO } from "../dto";
import { BadResponseHandler, FormErrorsHandler } from "../errorHandler";
import { hashPassword } from "../utils/bcrypt.helper";

export default class ForgotPasswordController {
	private emailService = new EmailService();
	private userMasterService = new UserMasterService();
	private customerDetailsService = new CustomerDetailsService();
	private forgotPasswordService = new ForgotPasswordService();

	public forgotPassword = {
		validation: { email: "required|email" },
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const email: string = req.query["email"] as string;
			if (email) {
				const userType = new ForgotPasswordDTO(req.body);

				let emailCheck = false;
				if (userType.user_type == FORGOT_PASSWORD_USER_TYPE.ADMIN) {
					emailCheck = await this.userMasterService.findOne({ email: email, is_deleted: false }).then((data) => data != null || data != undefined);
				} else {
					const customerDetails = await this.customerDetailsService.findOne({ customer_email: email, is_deleted: false }, true);

					if (customerDetails && customerDetails.is_active == true && customerDetails.password == null) {
						throw new BadResponseHandler("Your email is not verified. Please contact Admin.");
					}
					if (customerDetails != null || customerDetails != undefined) {
						emailCheck = true;
					}
					// .then((data) => data != null || data != undefined);
				}

				if (emailCheck == true) {
					const resetPasswordExpirationMinutes = config.resetPasswordExpirationMinutes || 10;
					const expiry: any = moment().add(resetPasswordExpirationMinutes, "minute").format("YYYY-MM-DD HH:mm:ss");

					const securityCode = randomstring.generate(6);
					const forgotPasswordData = {
						email,
						expiry,
						securityCode,
						user_type: userType.user_type,
					};

					await this.forgotPasswordService.forgotPassword(forgotPasswordData);
					const forgotDataStr = JSON.stringify(forgotPasswordData);
					const encodedCode = btoa(forgotDataStr);

					await this.emailService.sendForgotPasswordEmail(encodedCode, forgotPasswordData.email);
					return res.api.create({
						message: "Email sent successfully",
					});
				} else {
					return res.api.badResponse({ message: "Email Not Found" });
				}
			} else {
				return res.api.badResponse({ message: "Email Not Found" });
			}
		},
	};

	public verifyUrl = {
		validation: { code: "required|string" },
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const encodedCode: string = req.query["code"] as string;
			if (encodedCode) {
				const data = await this.forgotPasswordService.verifyForgotPassUrl(encodedCode);
				return res.api.create(data.valid);
			} else {
				throw new FormErrorsHandler("Url not valid");
			}
		},
	};

	public passwordReset = {
		validation: { password: "required|string", code: "required|string" },
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const encodedCode: string = req.query["code"] as string;
			if (encodedCode) {
				const { password } = req.body;
				const data = await this.forgotPasswordService.verifyForgotPassUrl(encodedCode);
				if (data.valid == true) {
					const hashedPassword = await hashPassword(password);
					if (data.user_type == FORGOT_PASSWORD_USER_TYPE.ADMIN) {
						await UserMaster.update({ password: hashedPassword }, { where: { email: data.email, is_deleted: false } });
					} else {
						await CustomerDetails.update({ password: hashedPassword }, { where: { customer_email: data.email, is_deleted: false } });
					}
					await ForgotPassword.destroy({ where: { email: data.email, securityCode: data.securityCode } });
					return res.api.create({
						message: "Password Changed",
					});
				} else {
					throw new FormErrorsHandler("Url not valid");
				}
			} else {
				throw new FormErrorsHandler("Url not valid");
			}
		},
	};
}
