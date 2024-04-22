export default class UnauthorizedUserHandler {
	public message: string = "";

	constructor(message: string = "Unauthorized User!") {
		this.message = message;
	}
}
