import { QUOTATION_STATUS } from "../enum";

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined && value != "";
}

export class SearchQuotationDTO {
	from_date?: string;
	to_date?: string;
	status?: QUOTATION_STATUS;
	customer_id?: string;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.from_date ? (this.from_date = data.from_date) : delete this.from_date;
		data.to_date ? (this.to_date = data.to_date) : delete this.to_date;
		data.status ? (this.status = data.status) : delete this.status;
		data.customer_id ? (this.customer_id = data.customer_id) : delete this.customer_id;
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

class AttributeOptions {
	quotation_product_id?: string;
	attribute_name: string;
	option_name: string;

	constructor(data: any) {
		this.attribute_name = data.attribute_name;
		this.option_name = data.option_name;
	}
}

class OtherDetails {
	quotation_product_id?: string;
	detail_name: string;
	detail_value: string;

	constructor(data: any) {
		this.detail_name = data.detail_name;
		this.detail_value = data.detail_value;
	}
}

export class QuotationProductsDTO {
	product_id: string;
	quotation_id: string;
	qty: number;
	notes: string;
	attributeOptions: Array<{ attribute_name: string; option_name: string }>;
	otherDetails: Array<{ detail_name: string; detail_value: string }>;
	constructor(data: any) {
		this.product_id = data.product_id;
		this.quotation_id = "";
		this.qty = data.qty;
		this.notes = data.notes;
		this.attributeOptions = data.attributeOptions
			.filter(notEmpty)
			.map((row: any) => new AttributeOptions({ attribute_name: row.attribute_name, option_name: row.option_name }));
		this.otherDetails = data.otherDetails
			.filter(notEmpty)
			.map((row: any) => new OtherDetails({ detail_name: row.detail_name, detail_value: row.detail_value }));
	}
}

export class QuotationDTO {
	customer_id: string;
	quotation_date: Date;
	quotationProducts: Array<QuotationProductsDTO>;

	constructor(data: any) {
		this.customer_id = data.customer_id;
		this.quotation_date = new Date();
		this.quotationProducts = data.quotationProducts.filter(notEmpty).map(
			(row: any) =>
				new QuotationProductsDTO({
					product_id: row.product_id,
					qty: row.qty,
					attributeOptions: row.attributeOptions,
					otherDetails: row.otherDetails,
					notes: row.notes,
				})
		);
	}
}
