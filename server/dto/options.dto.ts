export class SearchOptionsDTO {
	searchTxt?: string;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt != undefined && data.searchTxt != "" ? (this.searchTxt = data.searchTxt.trim()) : delete this.searchTxt;
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

export class OptionsDTO {
	name: string;
	details?: string;
	last_updated_by: string;

	constructor(data: any) {
		this.name = data.name.trim();
		data.details != undefined ? (this.details = data.details) : delete this.details;
		this.last_updated_by = data.loggedInUserId;
	}
}
