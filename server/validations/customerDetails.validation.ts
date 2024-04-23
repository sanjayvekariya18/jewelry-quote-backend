export default class CustomerDetailsValidations {
	public login = {
		customer_email: "required|email",
		password: "required|string",
	};

	public getAll = {
		searchTxt: "string",
		is_active: "boolean",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};

	public create = {
		customer_name: "required|string",
		customer_email: "required|string|email",
		country_code: "required|string",
		mobile_number: "required|digits:10",
		password: "required|string",
		whatsapp_number: "string",
		customer_address: "string",
		website: "string",
		business_registration: "string",
		customer_fax: "string",
		customer_business_card: "mimes:png,jpg,jpeg",
		association_membership: "string",
		linked_in: "string",
		facebook: "string",
		instagram: "string",
		business_reference: "string",
	};

	public edit = {
		customer_name: "required|string",
		customer_email: "required|string|email",
		country_code: "required|string",
		mobile_number: "required|digits:10",
		whatsapp_number: "string",
		customer_address: "string",
		website: "string",
		business_registration: "string",
		customer_fax: "string",
		customer_business_card: "mimes:png,jpg,jpeg",
		association_membership: "string",
		linked_in: "string",
		facebook: "string",
		instagram: "string",
		business_reference: "string",
	};

	public changePassword = {
		oldPassword: "required|string",
		newPassword: "required|string",
	};
}
