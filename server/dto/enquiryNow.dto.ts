export class SearchEnquiryNowDTO {
	searchTxt?: string;
	is_read?: boolean;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt ? (this.searchTxt = data.searchTxt.trim()) : delete this.searchTxt;
		data.is_read ? (this.is_read = data.is_read.toString() == "true") : delete this.is_read;
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

export class CreateEnquiryNowDTO {
	customer_id: string;
	product_ids: string;
	email: string;
	contact_number: string;
	notes: string;

	constructor(data: any) {
		this.customer_id = data.customer_id;
		this.product_ids = data.product_ids.trim();
		this.email = data.email.trim();
		this.contact_number = data.contact_number.trim();
		this.notes = data.notes.trim();
	}
}
