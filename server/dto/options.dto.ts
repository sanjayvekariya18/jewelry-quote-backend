export class SearchOptionsDTO {
	searchTxt?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.searchTxt != undefined && data.searchTxt != "" ? (this.searchTxt = data.searchTxt.trim()) : delete this.searchTxt;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
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
