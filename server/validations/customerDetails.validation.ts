import { DESCRIPTION_OF_BUSINESS } from "../enum";

export default class CustomerDetailsValidations {
	public login = {
		login_id: "required|numeric",
		password: "required|string",
	};

	public getAll = {
		searchTxt: "string",
		is_active: "boolean",
		page: "integer|min:0",
		rowsPerPage: "integer|min:1",
	};

	public create = {
		token: "required|string",
		company_name: "required|string",
		customer_name: "required|string",
		customer_email: "required|string|email",
		country_code: "required|numeric",
		mobile_number: "required|min:10|max:15",
		wp_country_code: "required|numeric",
		whatsapp_number: "required|string|min:10|max:15",
		customer_address: "required|string",
		city: "required|string",
		country: "required|string",
		zip_code: "required|string|min:5|max:10",
		website: "string",
		business_registration: "string",
		company_tax_number: "string",
		customer_business_card: "mimes:png,pdf,jpg,jpeg",
		association_membership: "string",
		description_of_business: "required|string|in:" + Object.values(DESCRIPTION_OF_BUSINESS),
		linked_in: "string",
		facebook: "string",
		instagram: "string",
	};

	public edit = {
		company_name: "required|string",
		customer_name: "required|string",
		customer_email: "required|string|email",
		country_code: "required|numeric",
		mobile_number: "required|min:10|max:15",
		wp_country_code: "required|numeric",
		whatsapp_number: "required|string|min:10|max:15",
		customer_address: "required|string",
		city: "required|string",
		country: "required|string",
		zip_code: "required|string|min:5|max:10",
		website: "string",
		business_registration: "string",
		company_tax_number: "string",
		customer_business_card: "mimes:png,pdf,jpg,jpeg",
		association_membership: "string",
		description_of_business: "required|string|in:" + Object.values(DESCRIPTION_OF_BUSINESS),
		linked_in: "string",
		facebook: "string",
		instagram: "string",
	};

	public changePassword = {
		oldPassword: "required|string",
		newPassword: "required|string",
	};
}
