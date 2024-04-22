export default class PermissionDeniedHandler {
	public message: string = "";

	constructor(message: string = "badResponse!") {
		this.message = message;
	}
}
