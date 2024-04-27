import { Op } from "sequelize";
import { SearchCustomerDetailsDTO, EditCustomerDetailsDTO, CreateCustomerDetailsDTO, CustomerChangePasswordDTO } from "../dto";
import { CustomerDetails } from "../models";
import { hashPassword } from "../utils/bcrypt.helper";
import { sequelizeConnection } from "../config/database";

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
				"customer_name",
				"customer_email",
				"country_code",
				"mobile_number",
				"whatsapp_number",
				"customer_address",
				"website",
				"business_registration",
				"customer_fax",
				"customer_business_card",
				"association_membership",
				"customer_social_media",
				"business_reference",
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
				"customer_name",
				"customer_email",
				"country_code",
				"mobile_number",
				"whatsapp_number",
				"customer_address",
				"website",
				"business_registration",
				"customer_fax",
				"customer_business_card",
				"association_membership",
				"customer_social_media",
				"business_reference",
				"is_active",
				...(includePassword == true ? ["password"] : []),
			],
			raw: true,
		});
	};

	public create = async (customerData: CreateCustomerDetailsDTO) => {
		customerData.password = await hashPassword(customerData.password);

		return await CustomerDetails.create(customerData);
	};

	public edit = async (customerId: string, customerData: EditCustomerDetailsDTO) => {
		return await CustomerDetails.update(customerData, { where: { id: customerId } }).then(async () => {
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

	public changePassword = async (customerId: string, passwordData: CustomerChangePasswordDTO) => {
		const hashedPassword: any = await hashPassword(passwordData.newPassword);
		return await CustomerDetails.update({ password: hashedPassword }, { where: { id: customerId } });
	};
}
