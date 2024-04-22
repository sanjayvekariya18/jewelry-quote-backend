import { Request, NextFunction, Response } from "express";
import { TokenExpiredUserHandler, UnauthorizedUserHandler } from "../errorHandler";
import moment from "moment";
import { isEmpty, _json } from "../utils/helper";
import { LoggedInUserTokenPayload } from "../services/authorization.service";
import { TokenService, AuthorizationService } from "../services";

const tokenService = new TokenService();
const authorizationService = new AuthorizationService();

const TokenVerifyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	if (req.url == "/login") {
		return next();
	}
	let authorization = req.header("Authorization");
	if (authorization) {
		authorization = authorization.replace("Bearer ", "");
		if (authorization && authorization != "null" && authorization != null) {
			return await tokenService
				.decode(authorization)
				.then(async (payload: LoggedInUserTokenPayload) => {
					const isExpire = !(payload.expires >= moment().unix());
					if (isExpire) {
						return next(new TokenExpiredUserHandler());
					}
					const _user = await authorizationService.findUserById(payload.user.id);
					if (isEmpty(_user)) {
						return next(new UnauthorizedUserHandler());
					}
					if (_user.is_active == false) {
						throw new UnauthorizedUserHandler("User deactivated. Contact admin");
					}
					req.authUser = _user;
					// req.permissions = _user.permissions;

					if (Array.isArray(req.body)) {
						req.body = req.body.map((data) => {
							return {
								...data,
								loggedInUserId: payload.user.id,
							};
						});
					} else {
						req.body["loggedInUserId"] = payload.user.id;
					}
					return next();
				})
				.catch((err) => next(err));
		} else {
			throw new UnauthorizedUserHandler();
		}
	} else {
		throw new UnauthorizedUserHandler();
	}
};
export default TokenVerifyMiddleware;
