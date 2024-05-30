export default class AddToQuoteValidations {
	public create = {
		product_id: "required|uuid",
		qty: "required|numeric|min:1",
		attributeOptions: "required|array|min:1",
		"attributeOptions.*.attribute_id": "required|uuid",
		"attributeOptions.*.option_id": "required|uuid",
		otherDetails: "array",
		"otherDetails.*.detail_name": "required|string",
		"otherDetails.*.detail_value": "required|string",
		notes: "string",
	};

	public edit = {
		qty: "required|numeric|min:1",
		notes: "string",
	};
}
