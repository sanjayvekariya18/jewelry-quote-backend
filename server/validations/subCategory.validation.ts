export default class SubCategoriesValidation {
	public getAll = {
		category_id: "uuid",
	};

	public create = {
		category_id: "required|uuid",
		name: "required|string",
		details: "string",
	};

	public edit = {
		category_id: "required|uuid",
		name: "string",
		details: "string",
	};
}
