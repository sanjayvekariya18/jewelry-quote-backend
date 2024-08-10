import { sequelizeConnection } from "../config/database";
import { CustomerDetails, EnquiryNow } from "../models";
import { enquiryNowDTO } from "../dto";
import { Op } from "sequelize";

export default class EnquiryNowService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: enquiryNowDTO.SearchEnquiryNowDTO) => {
		return await EnquiryNow.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					[Op.or]: [{ email: { [Op.like]: `%${searchParams.searchTxt}%` } }, { contact_number: { [Op.like]: `%${searchParams.searchTxt}%` } }],
				}),
				...(searchParams.is_read != undefined && { is_read: searchParams.is_read }),
				is_deleted: false,
			},
			order: [["createdAt", "DESC"]],
			attributes: ["id", "customer_id", "product_ids", "email", "contact_number", "notes", "is_read"],
			include: [{ model: CustomerDetails, attributes: ["id", "company_name", "customer_name", "customer_email"] }],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any) => {
		return await EnquiryNow.findOne({
			where: { ...searchObject, is_deleted: false },
			attributes: ["id", "customer_id", "product_ids", "email", "contact_number", "notes", "is_read"],
			include: [{ model: CustomerDetails, attributes: ["id", "company_name", "customer_name", "customer_email"] }],
		});
	};

	public create = async (enquiryData: enquiryNowDTO.CreateEnquiryNowDTO) => {
		return await EnquiryNow.create(enquiryData).then(async (data) => {
			return await this.findOne({ id: data.id });
		});
	};

	public toggleEnquiryIsRead = async (enquiryId: string, loggedInUserId: string) => {
		return await EnquiryNow.update(
			{
				is_read: this.Sequelize.literal(`Not \`is_read\``),
				last_updated_by: loggedInUserId,
			},
			{ where: { id: enquiryId } }
		).then(async () => {
			return await this.findOne({ id: enquiryId });
		});
	};

	public delete = async (enquiryId: string, loggedInUserId: string) => {
		return await EnquiryNow.update({ is_deleted: true, last_updated_by: loggedInUserId }, { where: { id: enquiryId } }).then(async () => {
			return "Enquiry deleted";
		});
	};
}
