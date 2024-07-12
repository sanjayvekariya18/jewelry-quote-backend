import { sequelizeConnection } from "../config/database";
import { EmailSubscribed } from "../models";
import { emailSubscribedDTO } from "../dto";
import { Op } from "sequelize";

export default class EmailSubscribedService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: emailSubscribedDTO.SearchEmailSubscribedDTO) => {
		return await EmailSubscribed.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					[Op.or]: [{ email: { [Op.like]: `%${searchParams.searchTxt}%` } }],
				}),
				is_deleted: false,
			},
			order: [["createdAt", "ASC"]],
			attributes: ["id", "email", "is_deleted", "last_updated_by", "createdAt"],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any) => {
		return await EmailSubscribed.findOne({
			where: { ...searchObject, is_deleted: false },
			attributes: ["id", "email", "is_deleted", "last_updated_by"],
		});
	};

	public create = async (email: string) => {
		return await EmailSubscribed.create({ email }).then(async (data) => {
			return "Thank you for subscribing with us.";
		});
	};

	public delete = async (catalog_id: string, loggedInUserId: string) => {
		return await EmailSubscribed.update({ is_deleted: true, last_updated_by: loggedInUserId }, { where: { id: catalog_id } });
	};
}
