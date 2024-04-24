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

export class CreateProductDTO {
	stock_id: string;
	sub_category_id: string;
	name: string;
	description?: string;
	last_updated_by: string;

	constructor(data: any) {
		this.stock_id = data.stock_id;
		this.sub_category_id = data.sub_category_id;
		this.name = data.name;
		data.description != undefined ? (this.description = data.description) : delete this.description;
		this.last_updated_by = data.loggedInUserId;
	}
}

export class EditProductDTO {
	stock_id?: string;
	sub_category_id?: string;
	name?: string;
	description?: string;
	last_updated_by: string;

	constructor(data: any) {
		data.stock_id != undefined ? (this.stock_id = data.stock_id) : delete this.stock_id;
		data.sub_category_id != undefined ? (this.sub_category_id = data.sub_category_id) : delete this.sub_category_id;
		data.name != undefined ? (this.name = data.name) : delete this.name;
		data.description != undefined ? (this.description = data.description) : delete this.description;
		this.last_updated_by = data.loggedInUserId;
	}
}
