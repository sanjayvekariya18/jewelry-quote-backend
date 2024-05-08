import { sequelizeConnection } from "../config/database";
import { OtherDetailMaster } from "../models";
import { SearchCatalogDTO } from "../dto";
import { Op } from "sequelize";

export default class OtherDetailMasterService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async () => {
		return await OtherDetailMaster.findAndCountAll({
			attributes: ["id", "detail_name", "detail_type"],
			order: [["detail_name", "ASC"]],
		});
	};

	public findOne = async (searchObject: any) => {
		return await OtherDetailMaster.findOne({
			where: searchObject,
			attributes: ["id", "detail_name", "detail_type"],
		});
	};
}
