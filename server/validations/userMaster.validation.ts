export default class UserMasterValidation {
	public getAll = {
		searchTxt: "string",
		is_active: "boolean",
		page: "numeric|min:0",
		rowsPerPage: "numeric|min:1",
	};

	public create = {
		name: "required|string",
		email: "required|string|email",
		mobile_number: "string",
	};

	public edit = {
		name: "string",
		email: "string|email",
		mobile_number: "string",
	};

	public changePassword = {
		oldPassword: "required|string",
		newPassword: "required|string",
	};
}
