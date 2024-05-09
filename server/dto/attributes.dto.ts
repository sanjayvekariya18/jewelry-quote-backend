function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined && value != "";
}

export class SearchAttributesDTO {
	searchTxt?: string;
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		data.searchTxt != undefined && data.searchTxt != "" ? (this.searchTxt = data.searchTxt.trim()) : delete this.searchTxt;
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}

export class AttributesDTO {
	name: string;
	details?: string;
	options: Array<string>;
	position: number;
	last_updated_by: string;

	constructor(data: any) {
		this.name = data.name.trim();
		this.details = data.details;
		this.options = data.options.filter(notEmpty);
		this.position = data.position;
		this.last_updated_by = data.loggedInUserId;
	}
}
