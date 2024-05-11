export default class ProductValidation {
	public getAll = {
		searchTxt: "string",
		sub_category_id: "uuid",
		is_active: "boolean",
		page: "numeric",
		rowsPerPage: "numeric",
	};

	public getAllForCustomer = {
		searchTxt: "string",
		sub_category_id: "required_with:style|uuid",
		style: "required_with:setting_type|string",
		setting_type: "required_with:sub_setting|string",
		sub_setting: "string",
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
		otherDetails: "required|array|min:1",
		"otherDetails.*.other_detail_id": "required|uuid",
		"otherDetails.*.detail_value": "required|string",
	};
}
