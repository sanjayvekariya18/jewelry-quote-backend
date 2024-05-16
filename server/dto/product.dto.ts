function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined && value != "";
}

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

export class SearchProductForCustomerDTO {
	searchTxt?: string;
	sub_category_id?: string;
	catalog_master_id?: boolean;
	style?: string;
	setting_type?: string;
	sub_setting?: string;
	is_active?: boolean;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		data.sub_category_id != undefined ? (this.sub_category_id = data.sub_category_id) : delete this.sub_category_id;
		data.catalog_master_id != undefined ? (this.catalog_master_id = data.catalog_master_id) : delete this.catalog_master_id;
		data.style != undefined ? (this.style = data.style) : delete this.style;
		data.setting_type != undefined ? (this.setting_type = data.setting_type) : delete this.setting_type;
		data.sub_setting != undefined ? (this.sub_setting = data.sub_setting) : delete this.sub_setting;
		data.is_active != "" && data.is_active != undefined ? (this.is_active = data.is_active == "true") : delete this.is_active;
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

export class ProductAttributesOptionsDTO {
	attribute_id: string;
	product_id?: string;
	option_id: string;
	last_updated_by: string;

	constructor(data: any) {
		this.attribute_id = data.attribute_id;
		this.option_id = data.option_id;
		this.last_updated_by = data.last_updated_by;
	}
}

export class ProductOtherDetailDTO {
	product_id?: string;
	other_detail_id: string;
	detail_value: string;
	last_updated_by: string;

	constructor(data: any) {
		this.other_detail_id = data.other_detail_id;
		this.detail_value = data.detail_value;
		this.last_updated_by = data.last_updated_by;
	}
}

export class ProductDTO {
	stock_id: string;
	sub_category_id: string;
	name: string;
	description?: string;
	metal_type?: string;
	style?: string;
	setting_type?: string;
	sub_setting?: string;
	prong_type?: string;
	shank_type?: string;
	band_type?: string;
	fit_type?: string;
	lock_type?: string;
	bail_type?: string;
	catelog_master_id?: string;
	attributeOptions: Array<ProductAttributesOptionsDTO>;
	otherDetails: Array<ProductOtherDetailDTO>;
	last_updated_by: string;

	constructor(data: any) {
		this.stock_id = data.stock_id.toString().trim();
		this.sub_category_id = data.sub_category_id;
		this.name = data.name.toString().trim();
		data.description != undefined ? (this.description = data.description.toString().trim()) : delete this.description;
		data.metal_type != undefined ? (this.metal_type = data.metal_type.toString().trim()) : delete this.metal_type;
		data.style != undefined ? (this.style = data.style.toString().trim()) : delete this.style;
		data.setting_type != undefined ? (this.setting_type = data.setting_type.toString().trim()) : delete this.setting_type;
		data.sub_setting != undefined ? (this.sub_setting = data.sub_setting.toString().trim()) : delete this.sub_setting;
		data.prong_type != undefined ? (this.prong_type = data.prong_type.toString().trim()) : delete this.prong_type;
		data.shank_type != undefined ? (this.shank_type = data.shank_type.toString().trim()) : delete this.shank_type;
		data.band_type != undefined ? (this.band_type = data.band_type.toString().trim()) : delete this.band_type;
		data.fit_type != undefined ? (this.fit_type = data.fit_type.toString().trim()) : delete this.fit_type;
		data.lock_type != undefined ? (this.lock_type = data.lock_type.toString().trim()) : delete this.lock_type;
		data.bail_type != undefined ? (this.bail_type = data.bail_type.toString().trim()) : delete this.bail_type;
		this.attributeOptions = data.attributeOptions.filter(notEmpty).map(
			(row: any) =>
				new ProductAttributesOptionsDTO({
					attribute_id: row.attribute_id,
					option_id: row.option_id,
					last_updated_by: data.loggedInUserId,
				})
		);
		this.otherDetails = data.otherDetails.filter(notEmpty).map(
			(row: any) =>
				new ProductOtherDetailDTO({
					other_detail_id: row.other_detail_id,
					detail_value: row.detail_value,
					last_updated_by: data.loggedInUserId,
				})
		);

		this.last_updated_by = data.loggedInUserId;
	}
}
