function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined && value != "";
}

export class SearchCategoryDTO {
	searchTxt?: string;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt ? (this.searchTxt = data.searchTxt.trim()) : delete this.searchTxt;
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

export class CategoryDTO {
	name: string;
	details?: String;
	img_url?: string;
	logo_url?: string;
	last_updated_by: string;

	constructor(data: any) {
		this.name = data.name.trim();
		data.details != undefined ? (this.details = data.details) : delete this.details;
		this.last_updated_by = data.loggedInUserId;
	}
}
