export default class TokenExpiredUserHandler {
	public message: string = "";

	constructor(message: string = "Token Expired!") {
		this.message = message;
	}
}
