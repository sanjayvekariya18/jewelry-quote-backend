export default class CategoryValidations {
	public getAll = {
		searchTxt: "string",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};

	public category = {
		name: "required|string",
		details: "string",
	};
}
