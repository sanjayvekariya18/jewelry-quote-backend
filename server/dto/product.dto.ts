function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined && value != "";
}

export class SearchProductDTO {
	searchTxt?: string;
	sub_category_id?: string;
	is_active?: boolean;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		data.sub_category_id != undefined ? (this.sub_category_id = data.sub_category_id) : delete this.sub_category_id;
		data.is_active != "" && data.is_active != undefined ? (this.is_active = data.is_active == "true") : delete this.is_active;
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

export class ProductAttributesOptionsDTO {
	attribute_id: string;
	product_id?: string;
	option_id: string;
	last_updated_by: string;

	constructor(data: any) {
		this.attribute_id = data.attribute_id;
		this.option_id = data.option_id;
		this.last_updated_by = data.last_updated_by;
	}
}

export class ProductDTO {
	stock_id: string;
	sub_category_id: string;
	name: string;
	description?: string;
	attributeOptions: Array<ProductAttributesOptionsDTO>;
	last_updated_by: string;

	constructor(data: any) {
		this.stock_id = data.stock_id.trim();
		this.sub_category_id = data.sub_category_id;
		this.name = data.name.trim();
		data.description != undefined ? (this.description = data.description.trim()) : delete this.description;
		this.attributeOptions = data.attributeOptions.filter(notEmpty).map(
			(row: any) =>
				new ProductAttributesOptionsDTO({
					attribute_id: row.attribute_id,
					option_id: row.option_id,
					last_updated_by: data.loggedInUserId,
				})
		);

		this.last_updated_by = data.loggedInUserId;
	}
}
