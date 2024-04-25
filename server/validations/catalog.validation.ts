export default class CatalogValidations {
	public getAll = {
		searchTxt: "string",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};

	public create = {
		name: "required|string",
		details: "string",
		img_url: "mimes:png,jpg,jpeg",
		pdf_url: "mimes:pdf",
		catalog_products: "required|array|min:1",
	};
}
