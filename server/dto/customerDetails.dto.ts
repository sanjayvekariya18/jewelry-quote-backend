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
	customer_name: string;
	customer_email: string;
	country_code: string;
	mobile_number: string;
	whatsapp_number?: string;
	customer_address?: string;
	website?: string;
	business_registration?: string;
	customer_fax?: string;
	customer_business_card?: string;
	association_membership?: string;
	customer_social_media?: SocialMedia;
	business_reference?: string;

	constructor(data: any) {
		this.customer_name = data.customer_name;
		this.customer_email = data.customer_email;
		this.country_code = data.country_code;
		this.mobile_number = data.mobile_number;
		data.whatsapp_number != undefined ? (this.whatsapp_number = data.whatsapp_number) : delete this.whatsapp_number;
		data.customer_address != undefined ? (this.customer_address = data.customer_address) : delete this.customer_address;
		data.website != undefined ? (this.website = data.website) : delete this.website;
		data.business_registration != undefined ? (this.business_registration = data.business_registration) : delete this.business_registration;
		data.customer_fax != undefined ? (this.customer_fax = data.customer_fax) : delete this.customer_fax;
		data.association_membership != undefined ? (this.association_membership = data.association_membership) : delete this.association_membership;
		this.customer_social_media = { linked_in: data.linked_in || "", facebook: data.facebook || "", instagram: data.instagram || "" };
		data.business_reference != undefined ? (this.business_reference = data.business_reference) : delete this.business_reference;
	}
}

export class EditCustomerDetailsDTO {
	customer_name?: string;
	customer_email?: string;
	country_code?: string;
	mobile_number?: string;
	whatsapp_number?: string;
	customer_address?: string;
	website?: string;
	business_registration?: string;
	customer_fax?: string;
	customer_business_card?: string;
	association_membership?: string;
	customer_social_media?: SocialMedia;
	business_reference?: string;

	constructor(data: any) {
		data.customer_name != undefined ? (this.customer_name = data.customer_name) : delete this.customer_name;
		data.customer_email != undefined ? (this.customer_email = data.customer_email) : delete this.customer_email;
		data.country_code != undefined ? (this.country_code = data.country_code) : delete this.country_code;
		data.mobile_number != undefined ? (this.mobile_number = data.mobile_number) : delete this.mobile_number;

		data.whatsapp_number != undefined ? (this.whatsapp_number = data.whatsapp_number) : delete this.whatsapp_number;
		data.customer_address != undefined ? (this.customer_address = data.customer_address) : delete this.customer_address;
		data.website != undefined ? (this.website = data.website) : delete this.website;
		data.business_registration != undefined ? (this.business_registration = data.business_registration) : delete this.business_registration;
		data.customer_fax != undefined ? (this.customer_fax = data.customer_fax) : delete this.customer_fax;
		data.association_membership != undefined ? (this.association_membership = data.association_membership) : delete this.association_membership;
		this.customer_social_media = {
			linked_in: data.linked_in != undefined ? data.linked_in : "",
			facebook: data.facebook != undefined ? data.facebook : "",
			instagram: data.instagram != undefined ? data.instagram : "",
		};
		data.business_reference != undefined ? (this.business_reference = data.business_reference) : delete this.business_reference;
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
