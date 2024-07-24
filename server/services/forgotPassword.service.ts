import moment from "moment";
import { FormErrorsHandler, UnauthorizedUserHandler } from "../errorHandler";
import { ForgotPassword } from "../models";
import { ForgotPasswordDTO } from "../dto";

export default class ForgotPasswordService {
	public forgotPassword = async (forgotPasswordData: ForgotPasswordDTO) => {
		return await ForgotPassword.create(forgotPasswordData);
	};

	public verifyForgotPassUrl = async (encodeUrl: string) => {
		let verifyObj: any;
		try {
			const decodedString = atob(encodeUrl);
			verifyObj = JSON.parse(decodedString);
		} catch (error) {
			throw new FormErrorsHandler("Url not valid");
		}

		if (verifyObj.email && verifyObj.expiry && verifyObj.securityCode && verifyObj.user_type) {
			const checkForgotData = await ForgotPassword.findOne({
				where: {
					email: verifyObj.email,
					securityCode: verifyObj.securityCode,
					user_type: verifyObj.user_type,
				},
			});
			if (checkForgotData != null) {
				const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
				if (moment(currentDate).isSameOrBefore(verifyObj.expiry)) {
					return { valid: true, email: verifyObj.email, securityCode: verifyObj.securityCode, user_type: checkForgotData.user_type };
				} else {
					throw new UnauthorizedUserHandler("Token Expired Please Try again");
				}
			} else {
				throw new UnauthorizedUserHandler("Url not valid");
			}
		} else {
			throw new FormErrorsHandler("Url not valid");
		}
	};
}
