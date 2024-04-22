export default class BadResponseHandler {
	public message: string = "";

	constructor(message: string = "badResponse!") {
		this.message = message;
	}
}
