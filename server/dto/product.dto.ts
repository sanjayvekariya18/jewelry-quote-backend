export class SearchProductDTO {
	searchTxt?: string;
	sub_category_id?: string;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		data.sub_category_id != undefined ? (this.sub_category_id = data.sub_category_id) : delete this.sub_category_id;
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

export class CreateProductDTO {
	sub_category_id: string;
	name: string;
	description?: string;
	last_updated_by: string;

	constructor(data: any) {
		this.sub_category_id = data.sub_category_id;
		this.name = data.name;
		data.description != undefined ? (this.description = data.description) : delete this.description;
		this.last_updated_by = data.loggedInUserId;
	}
}

export class EditProductDTO {
	sub_category_id?: string;
	name?: string;
	description?: string;
	last_updated_by: string;

	constructor(data: any) {
		data.sub_category_id != undefined ? (this.sub_category_id = data.sub_category_id) : delete this.sub_category_id;
		data.name != undefined ? (this.name = data.name) : delete this.name;
		data.description != undefined ? (this.description = data.description) : delete this.description;
		this.last_updated_by = data.loggedInUserId;
	}
}
