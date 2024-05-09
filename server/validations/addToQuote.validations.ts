export default class AddToQuoteValidations {
	public create = {
		product_id: "required|uuid",
		qty: "required|numeric",
		attributeOptions: "required|array|min:1",
		"attributeOptions.*.attribute_id": "required|uuid",
		"attributeOptions.*.option_id": "required|uuid",
		otherDetails: "required|array|min:1",
		"otherDetails.*.detail_name": "required|string",
		"otherDetails.*.detail_value": "required|string",
		notes: "string",
		// styleMaster: "required|array|min:1",
		// "styleMaster.*": "required|string",
	};

	public edit = {
		qty: "required|numeric",
		notes: "string",
		// attributeOptions: "required|array|min:1",
		// "attributeOptions.*.attribute_id": "required|uuid",
		// "attributeOptions.*.option_id": "required|uuid",
	};
}
