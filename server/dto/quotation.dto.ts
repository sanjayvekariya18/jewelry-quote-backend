import { QUOTATION_STATUS } from "../enum";

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined && value != "";
}

export class SearchQuotationDTO {
	// searchTxt?: string;
	from_date?: string;
	to_date?: string;
	status?: QUOTATION_STATUS;
	customer_id?: string;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		// data.searchTxt ? (this.searchTxt = data.searchTxt.trim()) : delete this.searchTxt;
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

export class QuotationProductsDTO {
	product_id: string;
	quotation_id: string;
	qty: number;
	attributeOptions: Array<{ attribute_name: string; option_name: string }>;
	styleMaster: Array<string>;

	constructor(data: any) {
		this.product_id = data.product_id;
		this.quotation_id = "";
		this.qty = data.qty;
		this.attributeOptions = data.attributeOptions.filter(notEmpty).map(
			(row: any) =>
				new AttributeOptions({
					attribute_name: row.attribute_name,
					option_name: row.option_name,
				})
		);
		this.styleMaster = data.styleMaster.filter(notEmpty);
	}
}

export class QuotationDTO {
	customer_id: string;
	quotation_date: Date;
	notes?: string;
	quotationProducts: Array<QuotationProductsDTO>;

	constructor(data: any) {
		this.customer_id = data.customer_id;
		this.quotation_date = new Date();
		data.notes != undefined ? (this.notes = data.notes) : delete this.notes;
		this.quotationProducts = data.quotationProducts.filter(notEmpty).map(
			(row: any) =>
				new QuotationProductsDTO({
					product_id: row.product_id,
					qty: row.qty,
					attributeOptions: row.attributeOptions,
					styleMaster: row.styleMaster,
				})
		);
	}
}
