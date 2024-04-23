import { Request, NextFunction, Response } from "express";
import { TokenExpiredUserHandler, UnauthorizedUserHandler } from "../errorHandler";
import moment from "moment";
import { _json } from "../utils/helper";
import { LoggedInCustomerTokenPayload } from "../services/authorization.service";
import { TokenService, CustomerDetailsService } from "../services";

const tokenService = new TokenService();
const customerService = new CustomerDetailsService();

const PublicTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
	if (req.url == "/login" || req.url == "/registration") {
		return next();
	}
	let authorization = req.header("Authorization");

	if (authorization) {
		authorization = authorization.replace("Bearer ", "");
		if (authorization && authorization != "null" && authorization != null) {
			return tokenService
				.decode(authorization)
				.then(async (payload: LoggedInCustomerTokenPayload) => {
					if (!payload?.customer?.id) {
						throw new UnauthorizedUserHandler("Invalid Token");
					}
					const isExpire = !(payload.expires >= moment().unix());
					if (isExpire) {
						return next(new TokenExpiredUserHandler());
					}

					const _customer = await customerService.findOne({ id: payload.customer.id });
					if (_customer == null) {
						return next(new UnauthorizedUserHandler());
					}

					if (_customer.is_active == false) {
						throw new UnauthorizedUserHandler("User deactivated. Contact admin");
					}
					req.customer = _customer;

					if (Array.isArray(req.body)) {
						req.body = req.body.map((data) => {
							return {
								...data,
								loggedInUserId: payload.customer.id,
							};
						});
					} else {
						req.body["loggedInUserId"] = payload.customer.id;
					}
					return next();
				})
				.catch((err) => next(err));
		} else {
			throw new UnauthorizedUserHandler();
		}
	} else {
		return next(new UnauthorizedUserHandler());
	}
};
export default PublicTokenMiddleware;
