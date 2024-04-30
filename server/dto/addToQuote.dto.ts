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

export class CreateAddToQuoteDTO {
	customer_id: string;
	product_id: string;
	qty: number;
	attributeOptions: Array<ATQAttributesOptionsDTO>;

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
	}
}
