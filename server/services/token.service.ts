import config from "../config/config";
import jwt from "jsonwebtoken";
import moment from "moment";
import { LoggedInUserDetails, LoggedInUserTokenPayload } from "./authorization.service";

export default class TokenService {
	/**
	 * Generate token
	 * @param {ObjectId} userId
	 * @param {Moment} expires
	 * @param {string} [secret]
	 * @returns {string}
	 */
	public generateToken = (userId: any, expires: any, secret = config.jwt.secret) => {
		const payload = {
			sub: userId,
			iat: moment().unix(),
			exp: expires.unix(),
		};
		return jwt.sign(payload, secret);
	};

	/**
	 * Verify token and return token doc (or throw an error if it is not valid)
	 * @param {string} token
	 * @param {string} type
	 * @returns {Promise<Token>}
	 */
	public verifyToken = async (token: any) => {
		return jwt.verify(token, config.jwt.secret, async (err: any, payload: any) => {
			if (err) throw err;
			// const user = await userService.updateUser(payload.sub , {password} );
			return payload;
		});
	};

	/**
	 * @param {Object} user
	 * @param {Date Time Object} expires
	 * @param {string} accessToken
	 * @return Success : Token
	 */
	public generateAccessToken = (user: any, expires: any) => {
		const payload = {
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
			iat: moment().unix(),
			exp: expires.unix(),
		};
		return jwt.sign(payload, config.jwt.secret);
	};

	/**
	 * Generate auth tokens
	 * @param {User} user
	 * @returns {Promise<any>}
	 */
	public generateAuthTokens = (user: any): Promise<any> => {
		return new Promise((resolve, reject) => {
			const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
			const accessToken = this.generateAccessToken(user, accessTokenExpires);
			resolve({
				token: accessToken,
				expires: accessTokenExpires.toDate(),
			});
		});
	};

	/**
	 * @param {String} token
	 * @return Success : { user: x, bearerToken: x }
	 * @return Error : DB error or User not Found
	 */
	public verifyAccessToken = (token: any): Promise<any> => {
		return new Promise(function (resolve, reject) {
			jwt.verify(token, config.jwt.secret, function (err: any, decoded: any) {
				if (err) {
					reject(err);
				} else {
					resolve({ memberId: decoded.user.id, email: decoded.user.email, name: decoded.user.name });
				}
			});
		});
	};

	/**
	 * Generate admin token
	 * @param {UserOutput} user
	 * @returns {Promise<any>}
	 */
	public generateUserAccessToken = (user: LoggedInUserDetails): Promise<any> => {
		return new Promise((resolve, reject) => {
			const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
			const payload: LoggedInUserTokenPayload = {
				user: user,
				expires: accessTokenExpires.unix()
			};
			const accessToken = this.encode(payload, config.jwt.secret);
			resolve({
				token: accessToken,
				expires: accessTokenExpires.toDate(),
			});
		});
	};

	public encode = (payload: any, secret = config.jwt.secret): string => {
		return jwt.sign(payload, secret);
	};

	public decode = (token: any, secret = config.jwt.secret): Promise<any> => {
		return new Promise(function (resolve, reject) {
			jwt.verify(token, secret, function (err: any, decoded: any) {
				if (err) {
					reject(err);
				} else {
					resolve(decoded);
				}
			});
		});
	};
}

export interface NewAccessToken {
	token: any;
	expires: Date;
}
