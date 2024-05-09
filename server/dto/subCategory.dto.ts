function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined && value != "";
}
export class SearchSubCategoryDTO {
	searchTxt?: string;
	category_id?: string;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		data.category_id != undefined ? (this.category_id = data.category_id) : delete this.category_id;
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
	attributes: Array<string>;
	last_updated_by: string;

	constructor(data: any) {
		this.category_id = data.category_id;
		this.name = data.name;
		data.details != undefined ? (this.details = data.details) : delete this.details;
		this.attributes = data.attributes.filter(notEmpty);
		this.last_updated_by = data.loggedInUserId;
	}
}

export class EditSubCategoryDTO {
	category_id?: string;
	name?: string;
	img_url?: string;
	logo_url?: string;
	details?: string;
	attributes: Array<string>;
	last_updated_by: string;

	constructor(data: any) {
		data.category_id != undefined ? (this.category_id = data.category_id) : delete this.category_id;
		data.name != undefined ? (this.name = data.name) : delete this.name;
		data.details != undefined ? (this.details = data.details) : delete this.details;
		this.attributes = data.attributes.filter(notEmpty);
		this.last_updated_by = data.loggedInUserId;
	}
}
