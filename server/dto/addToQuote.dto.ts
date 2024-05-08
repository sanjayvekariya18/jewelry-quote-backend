function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined && value != "";
}

export class ATQAttributesOptionsDTO {
	attribute_id: string;
	add_to_quote_id?: string;
	option_id: string;

	constructor(data: any) {
		this.attribute_id = data.attribute_id;
		this.option_id = data.option_id;
	}
}

export class ATQOtherDetailDTO {
	add_to_quote_id?: string;
	detail_name: string;
	detail_value: string;

	constructor(data: any) {
		this.detail_name = data.detail_name;
		this.detail_value = data.detail_value;
	}
}

export class CreateAddToQuoteDTO {
	customer_id: string;
	product_id: string;
	qty: number;
	attributeOptions: Array<ATQAttributesOptionsDTO>;
	otherDetails: Array<ATQOtherDetailDTO>;
	notes?: string;
	// styleMaster: Array<string>;

	constructor(data: any) {
		this.customer_id = data.loggedInUserId;
		this.product_id = data.product_id;
		this.qty = Number(data.qty);
		this.attributeOptions = data.attributeOptions.filter(notEmpty).map(
			(row: any) =>
				new ATQAttributesOptionsDTO({
					attribute_id: row.attribute_id,
					option_id: row.option_id,
				})
		);
		this.otherDetails = data.otherDetails.filter(notEmpty).map(
			(row: any) =>
				new ATQOtherDetailDTO({
					detail_name: row.detail_name,
					detail_value: row.detail_value,
				})
		);
		data.notes != undefined ? (this.notes = data.notes.trim()) : delete this.notes;
		// this.styleMaster = data.styleMaster.filter(notEmpty);
	}
}

export class EditAddToQuoteDTO {
	qty: number;
	notes?: string;
	// attributeOptions: Array<ATQAttributesOptionsDTO>;

	constructor(data: any) {
		this.qty = Number(data.qty);
		data.notes != undefined ? (this.notes = data.notes.trim()) : delete this.notes;
		// this.attributeOptions = data.attributeOptions.filter(notEmpty).map(
		// 	(row: any) =>
		// 		new ATQAttributesOptionsDTO({
		// 			attribute_id: row.attribute_id,
		// 			option_id: row.option_id,
		// 		})
		// );
	}
}
