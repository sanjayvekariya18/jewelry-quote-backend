import { FORGOT_PASSWORD_USER_TYPE } from "../enum";

export class ForgotPasswordDTO {
	email: string;
	expiry: Date;
	securityCode: string;
	user_type: FORGOT_PASSWORD_USER_TYPE;

	constructor(data: any) {
		this.email = data.email;
		this.expiry = data.expiry;
		this.securityCode = data.securityCode;
		this.user_type = data.user_type;
	}
}
