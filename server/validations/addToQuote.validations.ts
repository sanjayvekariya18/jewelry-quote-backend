export default class AddToQuoteValidations {
	public create = {
		product_id: "required|uuid",
		qty: "required|numeric",
		attributeOptions: "required|array|min:1",
		"attributeOptions.*.attribute_id": "required|uuid",
		"attributeOptions.*.option_id": "required|uuid",
		styleMaster: "required|array|min:1",
		"styleMaster.*": "required|string",
	};

	public edit = {
		qty: "required|numeric",
		// attributeOptions: "required|array|min:1",
		// "attributeOptions.*.attribute_id": "required|uuid",
		// "attributeOptions.*.option_id": "required|uuid",
	};
}
