import { Op } from "sequelize";
import { SearchCustomerDetailsDTO, EditCustomerDetailsDTO, CreateCustomerDetailsDTO, CustomerChangePasswordDTO } from "../dto";
import { CustomerDetails } from "../models";
import { hashPassword } from "../utils/bcrypt.helper";
import { sequelizeConnection } from "../config/database";
import { API } from ".";
import { config } from "../config";

export default class CustomerDetailsService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchCustomerDetailsDTO) => {
		return await CustomerDetails.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					[Op.or]: [
						{
							customer_name: {
								[Op.like]: "%" + searchParams.searchTxt + "%",
							},
						},
						{
							customer_email: {
								[Op.like]: "%" + searchParams.searchTxt + "%",
							},
						},
						{
							mobile_number: {
								[Op.like]: searchParams.searchTxt + "%",
							},
						},
					],
				}),
				...(searchParams.is_active != undefined && {
					is_active: searchParams.is_active,
				}),
				is_deleted: false,
			},
			attributes: [
				"id",
				"company_name",
				"customer_name",
				"customer_email",
				"login_id",
				"country_code",
				"mobile_number",
				"wp_country_code",
				"whatsapp_number",
				"customer_address",
				"address_map_link",
				"city",
				"country",
				"zip_code",
				"website",
				"business_registration",
				"company_tax_number",
				"customer_business_card",
				"association_membership",
				"description_of_business",
				"customer_social_media",
				"is_active",
			],
			order: [["customer_name", "ASC"]],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any, includePassword: boolean = false) => {
		return await CustomerDetails.findOne({
			where: {
				...searchObject,
				is_deleted: false,
			},
			attributes: [
				"id",
				"company_name",
				"customer_name",
				"customer_email",
				"login_id",
				"country_code",
				"mobile_number",
				"wp_country_code",
				"whatsapp_number",
				"customer_address",
				"address_map_link",
				"city",
				"country",
				"zip_code",
				"website",
				"business_registration",
				"company_tax_number",
				"customer_business_card",
				"association_membership",
				"description_of_business",
				"customer_social_media",
				"is_active",
				...(includePassword == true ? ["password"] : []),
			],
			raw: true,
		});
	};

	public create = async (customerData: CreateCustomerDetailsDTO) => {
		return await CustomerDetails.create(customerData);
	};

	public reCaptchaAuth = async (token: string) => {
		const responseData: any = await API.post(
			`https://www.google.com/recaptcha/api/siteverify?secret=${config.captcha.secret_key}&response=${token}`,
			{}
		).catch((error) => {
			console.log("reCaptchaAuth", error);
		});

		return responseData.success || false;
	};

	public edit = async (customer_id: string, customerData: EditCustomerDetailsDTO) => {
		return await CustomerDetails.update(customerData, { where: { id: customer_id } }).then(async () => {
			return "Data Edited successfully";
		});
	};

	public delete = async (id: string) => {
		return await CustomerDetails.update({ is_deleted: true }, { where: { id } });
	};

	public toggleCustomerActive = async (id: string) => {
		return await CustomerDetails.update(
			{
				is_active: this.Sequelize.literal(`Not \`is_active\``),
			},
			{ where: { id } }
		).then(async () => {
			return await this.findOne({ id });
		});
	};

	public changePassword = async (customer_id: string, passwordData: CustomerChangePasswordDTO) => {
		const hashedPassword: any = await hashPassword(passwordData.newPassword);
		return await CustomerDetails.update({ password: hashedPassword }, { where: { id: customer_id } });
	};
}
