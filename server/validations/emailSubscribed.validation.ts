export default class EmailSubscribedValidation {
	public getAll = {
		searchTxt: "string",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};

	public create = {
		email: "required|email",
	};
}
