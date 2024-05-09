export default class OptionsValidations {
	public getAll = {
		searchTxt: "string",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};

	public options = {
		name: "required|string",
		details: "string",
	};
}
