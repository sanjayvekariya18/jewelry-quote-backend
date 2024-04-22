import { NextFunction, Request, Response } from "express";
import { TokenService, UserMasterService } from "../services";
import { NewAccessToken } from "../services/token.service";
import { UnauthorizedUserHandler } from "../errorHandler";
import { comparePassword } from "../utils/bcrypt.helper";

export default class AuthorizationController {
	private userMasterServices = new UserMasterService();
	private tokenServices = new TokenService();

	public login = {
		validation: {
			email: "required|string",
			password: "required|string",
		},
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			await this.userMasterServices
				.findOne({ email: req.body.email.trim() }, true)
				.then(async (userData) => {
					if (userData && userData != null) {
						if (userData.is_active == false) {
							throw new UnauthorizedUserHandler("User deactivated. Contact admin");
						}
						await comparePassword(req.body.password.trim(), userData.password)
							.then(async () => {
								const tokenPayload = {
									id: userData.id,
									name: userData.name,
								};
								await this.tokenServices
									.generateUserAccessToken(tokenPayload)
									.then(async (tokenInfo: NewAccessToken) => {
										return res.api.create({
											token: tokenInfo.token,
											user: tokenPayload,
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
}
