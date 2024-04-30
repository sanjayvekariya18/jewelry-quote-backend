export default class ProductValidation {
	public getAll = {
		searchTxt: "string",
		sub_category_id: "uuid",
		is_active: "boolean",
		page: "numeric",
		rowsPerPage: "numeric",
	};

	public create = {
		stock_id: "required|string",
		sub_category_id: "required|uuid",
		name: "required|string",
		description: "string",
		attributeOptions: "required|array|min:1",
		"attributeOptions.*.attribute_id": "required|uuid",
		"attributeOptions.*.option_id": "required|uuid",
	};

	// public edit = {
	// 	stock_id: "string",
	// 	sub_category_id: "uuid",
	// 	name: "string",
	// 	description: "string",
	// };
}
