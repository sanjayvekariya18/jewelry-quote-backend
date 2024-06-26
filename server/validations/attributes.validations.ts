export default class AttributesValidations {
	public getAll = {
		searchTxt: "string",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};

	public attributes = {
		name: "required|string",
		details: "string",
		options: "required|array|min:1",
		"options.*": "required|uuid",
	};
}
