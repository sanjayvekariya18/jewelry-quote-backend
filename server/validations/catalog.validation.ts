export default class CatalogValidations {
	public getAll = {
		searchTxt: "string",
		show_live_products: "required|boolean",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};

	public create = {
		name: "required|string",
		description: "string",
		img_url: "mimes:png,jpg,jpeg",
		pdf_url: "mimes:pdf",
		catalog_products: "array|min:1",
		"catalog_products.*": "uuid",
		callback: (formData: any) => {
			if (formData?.catalog_products && !Array.isArray(formData.catalog_products)) {
				return { rules: {}, formRequest: { ...formData, catalog_products: [formData.catalog_products] } };
			}
			return { rules: {}, formRequest: { ...formData } };
		},
	};
}
