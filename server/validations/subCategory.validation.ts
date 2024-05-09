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
		img_url: "mimes:png,jpg,jpeg",
		logo_url: "mimes:png,jpg,jpeg",
		attributes: "required|array|min:1",
		"attributes.*": "required|uuid",
		callback: (formData: any) => {
			if (formData?.attributes && !Array.isArray(formData.attributes)) {
				return { rules: {}, formRequest: { ...formData, attributes: [formData.attributes] } };
			}
			return { rules: {}, formRequest: { ...formData } };
		},
	};

	public edit = {
		category_id: "required|uuid",
		name: "required|string",
		details: "string",
		img_url: "mimes:png,jpg,jpeg",
		logo_url: "mimes:png,jpg,jpeg",
		attributes: "required|array|min:1",
		"attributes.*": "required|uuid",
		callback: (formData: any) => {
			if (formData?.attributes && !Array.isArray(formData.attributes)) {
				return { rules: {}, formRequest: { ...formData, attributes: [formData.attributes] } };
			}
			return { rules: {}, formRequest: { ...formData } };
		},
	};
}
