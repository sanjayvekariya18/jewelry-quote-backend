function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined && value != "";
}

export class SearchCatalogDTO {
	searchTxt?: string;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt ? (this.searchTxt = data.searchTxt.trim()) : delete this.searchTxt;
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

export class SearchCustomerCatalogDTO {
	searchTxt?: string;
	show_live_products: boolean;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt ? (this.searchTxt = data.searchTxt.trim()) : delete this.searchTxt;
		this.show_live_products = data.show_live_products.toString() == "true";
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

export class CreateCatalogDTO {
	name: string;
	description?: string;
	img_url?: string;
	pdf_url?: string;
	catalog_products?: Array<string>;
	last_updated_by: string;

	constructor(data: any) {
		this.name = data.name.trim();
		data.description != undefined ? (this.description = data.description) : delete this.description;
		data.catalog_products && data.catalog_products?.length > 0
			? (this.catalog_products = data.catalog_products.filter(notEmpty))
			: delete this.catalog_products;
		this.last_updated_by = data.loggedInUserId;
	}
}

export class EditCatalogDTO {
	name: string;
	description?: string;
	img_url?: string;
	pdf_url?: string;
	catalog_products?: Array<string>;
	last_updated_by: string;

	constructor(data: any) {
		this.name = data.name.trim();
		data.description != undefined ? (this.description = data.description) : delete this.description;
		data.catalog_products && data.catalog_products?.length > 0
			? (this.catalog_products = data.catalog_products.filter(notEmpty))
			: delete this.catalog_products;
		this.last_updated_by = data.loggedInUserId;
	}
}
