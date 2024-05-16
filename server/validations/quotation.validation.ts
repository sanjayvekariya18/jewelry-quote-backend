import { QUOTATION_STATUS } from "../enum";

export default class QuotationValidations {
	public getAll = {
		from_date: "date",
		to_date: "date",
		status: "string|in:" + Object.values(QUOTATION_STATUS),
		customer_id: "uuid",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};
}
