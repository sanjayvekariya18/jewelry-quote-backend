export class SearchSubCategoryDTO {
	searchTxt?: string;
	// subcategoryId?: string;
	categoryId?: string;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		// data.subcategoryId != undefined ? (this.subcategoryId = data.subcategoryId) : delete this.subcategoryId;
		data.categoryId != undefined ? (this.categoryId = data.categoryId) : delete this.categoryId;
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

export class CreateSubCategoryDTO {
	category_id: string;
	name: string;
	img_url?: string;
	logo_url?: string;
	details?: string;
	last_updated_by: string;

	constructor(data: any) {
		this.category_id = data.category_id;
		this.name = data.name;
		data.details != undefined ? (this.details = data.details) : delete this.details;
		this.last_updated_by = data.loggedInUserId;
	}
}

export class EditSubCategoryDTO {
	category_id?: string;
	name?: string;
	img_url?: string;
	logo_url?: string;
	details?: string;
	last_updated_by: string;

	constructor(data: any) {
		data.category_id != undefined ? (this.category_id = data.category_id) : delete this.category_id;
		data.name != undefined ? (this.name = data.name) : delete this.name;
		data.details != undefined ? (this.details = data.details) : delete this.details;
		this.last_updated_by = data.loggedInUserId;
	}
}
