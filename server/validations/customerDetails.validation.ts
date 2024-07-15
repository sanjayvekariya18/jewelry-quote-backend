import { DESCRIPTION_OF_BUSINESS } from "../enum";

export default class CustomerDetailsValidations {
	public login = {
		email: "required|email",
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
		company_name: "required|string|regex:/^[a-zA-Z0-9 .]*$/",
		customer_name: "required|string|regex:/^[a-zA-Z ]*$/",
		customer_email: "required|string|email",
		country_code: "required|numeric",
		mobile_number: "required|min:10|max:15",
		wp_country_code: "required|numeric",
		whatsapp_number: "required|string|min:10|max:15",
		customer_address: "required|string|regex:/^[a-zA-Z0-9 ,.-]*$/",
		city: "required|string",
		country: "required|string",
		zip_code: "required|string|regex:/^[A-Z0-9 ,-]*$/",
		website: "string|regex:/^https?://[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)+([/?].*)?$/",
		business_registration: "string|regex:/^[a-zA-Z0-9 /-]*$/",
		company_tax_number: "string|regex:/^[a-zA-Z0-9 /-]*$/",
		customer_business_card: "mimes:png,pdf,jpg,jpeg",
		association_membership: "string|regex:/^[a-zA-Z0-9 ,.]*$/",
		description_of_business: "required|string|in:" + Object.values(DESCRIPTION_OF_BUSINESS),
		linked_in: "string|regex:/^(https?://)?(www.)?linkedin.com([/?].*)?$/",
		facebook: "string|regex:/^(https?://)?(www.)?facebook.com([/?].*)?$/",
		instagram: "string|regex:/^(https?://)?(www.)?instagram.com([/?].*)?$/",
	};

	public edit = {
		company_name: "required|string|regex:/^[a-zA-Z0-9 .]*$/",
		customer_name: "required|string|regex:/^[a-zA-Z ]*$/",
		// customer_email: "required|string|email",
		country_code: "required|numeric",
		mobile_number: "required|min:10|max:15",
		wp_country_code: "required|numeric",
		whatsapp_number: "required|string|min:10|max:15",
		customer_address: "required|string|regex:/^[a-zA-Z0-9 ,.-]*$/",
		city: "required|string",
		country: "required|string",
		zip_code: "required|string|regex:/^[A-Z0-9 ,-]*$/",
		website: "string|regex:/^https?://[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)+([/?].*)?$/",
		business_registration: "string|regex:/^[a-zA-Z0-9 /-]*$/",
		company_tax_number: "string|regex:/^[a-zA-Z0-9 /-]*$/",
		customer_business_card: "mimes:png,pdf,jpg,jpeg",
		association_membership: "string|regex:/^[a-zA-Z0-9 ,.]*$/",
		description_of_business: "required|string|in:" + Object.values(DESCRIPTION_OF_BUSINESS),
		linked_in: "string|regex:/^(https?://)?(www.)?linkedin.com([/?].*)?$/",
		facebook: "string|regex:/^(https?://)?(www.)?facebook.com([/?].*)?$/",
		instagram: "string|regex:/^(https?://)?(www.)?instagram.com([/?].*)?$/",
	};

	public changePassword = {
		oldPassword: "required|string",
		newPassword: "required|string",
	};
}
