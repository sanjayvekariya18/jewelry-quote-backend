import { DESCRIPTION_OF_BUSINESS } from "../enum";
import { SocialMedia } from "../models";

export class SearchCustomerDetailsDTO {
	searchTxt?: string;
	is_active?: boolean;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt != undefined ? (this.searchTxt = data.searchTxt) : delete this.searchTxt;
		data.is_active != "" && data.is_active != undefined ? (this.is_active = data.is_active == "true") : delete this.is_active;
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

export class CreateCustomerDetailsDTO {
	company_name: string;
	customer_name: string;
	customer_email: string;
	country_code: string;
	mobile_number: string;
	wp_country_code: string;
	whatsapp_number: string;
	customer_address: string;
	address_map_link: string;
	city: string;
	country: string;
	zip_code: string;
	website?: string;
	business_registration?: string;
	company_tax_number?: string;
	customer_business_card?: string;
	association_membership?: string;
	description_of_business: DESCRIPTION_OF_BUSINESS;
	customer_social_media?: SocialMedia;

	constructor(data: any) {
		this.company_name = data.company_name;
		this.customer_name = data.customer_name;
		this.customer_email = data.customer_email;
		this.country_code = data.country_code;
		this.mobile_number = data.mobile_number;
		this.wp_country_code = data.wp_country_code;
		this.whatsapp_number = data.whatsapp_number;
		this.customer_address = data.customer_address;
		this.address_map_link = data.address_map_link;
		this.address_map_link = data.address_map_link;
		this.city = data.city;
		this.country = data.country;
		this.zip_code = data.zip_code;
		data.website != undefined ? (this.website = data.website) : delete this.website;
		data.business_registration != undefined ? (this.business_registration = data.business_registration) : delete this.business_registration;
		data.company_tax_number != undefined ? (this.company_tax_number = data.company_tax_number) : delete this.company_tax_number;
		data.association_membership != undefined ? (this.association_membership = data.association_membership) : delete this.association_membership;
		this.description_of_business = data.description_of_business;
		this.customer_social_media = { linked_in: data.linked_in || "", facebook: data.facebook || "", instagram: data.instagram || "" };
	}
}

export class EditCustomerDetailsDTO {
	// company_name?: string;
	// customer_name?: string;
	// customer_email?: string;
	// country_code?: string;
	// mobile_number?: string;
	// wp_country_code?: string;
	// whatsapp_number?: string;
	customer_address?: string;
	// address_map_link?: string;
	// city?: string;
	// country?: string;
	// zip_code?: string;
	website?: string;
	business_registration?: string;
	company_tax_number?: string;
	customer_business_card?: string;
	association_membership?: string;
	// description_of_business?: DESCRIPTION_OF_BUSINESS;
	customer_social_media?: SocialMedia;

	constructor(data: any) {
		// data.company_name != undefined ? (this.company_name = data.company_name) : delete this.company_name;
		// data.customer_name != undefined ? (this.customer_name = data.customer_name) : delete this.customer_name;
		// data.customer_email != undefined ? (this.customer_email = data.customer_email) : delete this.customer_email;
		// data.country_code != undefined ? (this.country_code = data.country_code) : delete this.country_code;
		// data.mobile_number != undefined ? (this.mobile_number = data.mobile_number) : delete this.mobile_number;

		// data.wp_country_code != undefined ? (this.wp_country_code = data.wp_country_code) : delete this.wp_country_code;
		// data.whatsapp_number != undefined ? (this.whatsapp_number = data.whatsapp_number) : delete this.whatsapp_number;
		data.customer_address != undefined ? (this.customer_address = data.customer_address) : delete this.customer_address;
		// data.address_map_link != undefined ? (this.address_map_link = data.address_map_link) : delete this.address_map_link;
		// data.city != undefined ? (this.city = data.city) : delete this.city;
		// data.country != undefined ? (this.country = data.country) : delete this.country;
		// data.zip_code != undefined ? (this.zip_code = data.zip_code) : delete this.zip_code;
		data.website != undefined ? (this.website = data.website) : delete this.website;
		data.business_registration != undefined ? (this.business_registration = data.business_registration) : delete this.business_registration;
		data.company_tax_number != undefined ? (this.company_tax_number = data.company_tax_number) : delete this.company_tax_number;
		data.association_membership != undefined ? (this.association_membership = data.association_membership) : delete this.association_membership;
		// data.description_of_business != undefined ? (this.description_of_business = data.description_of_business) : delete this.description_of_business;
		this.customer_social_media = {
			linked_in: data.linked_in != undefined ? data.linked_in : "",
			facebook: data.facebook != undefined ? data.facebook : "",
			instagram: data.instagram != undefined ? data.instagram : "",
		};
	}
}

export class CustomerChangePasswordDTO {
	oldPassword: string;
	newPassword: string;

	constructor(data: any) {
		this.oldPassword = data.oldPassword;
		this.newPassword = data.newPassword;
	}
}
