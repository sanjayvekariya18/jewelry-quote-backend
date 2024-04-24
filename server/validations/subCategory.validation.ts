export default class SubCategoriesValidation {
	public getAll = {
		searchTxt: "string",
		category_id: "uuid",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};

	public create = {
		category_id: "required|uuid",
		name: "required|string",
		details: "string",
	};

	public edit = {
		category_id: "required|uuid",
		name: "required|string",
		details: "string",
	};
}
