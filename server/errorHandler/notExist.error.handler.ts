export default class NotExistHandler {
	public message: string;
	public success: boolean = false;

	constructor(message: any = "Not Exist", success: boolean = false) {
		this.message = message;
		this.success = success;
	}
}
