export class SearchStyleMasterDTO {
	searchTxt?: string;
	parent_id?: string | null;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.searchTxt != "" && data.searchTxt != undefined ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		data.parent_id != "" && data.parent_id != undefined ? (this.parent_id = data.parent_id) : null;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}
