export default class EnquiryNowValidations {
	public getAll = {
		searchTxt: "string",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};

	public create = {
		product_ids: "required|string",
		email: "required|email",
		contact_number: "required|integer",
		notes: "required|string",
	};
}
