import { Op } from "sequelize";
import { OptionsDTO, SearchOptionsDTO } from "../dto";
import { Options } from "../models";
import { sequelizeConnection } from "../config/database";

export default class OptionsService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchOptionsDTO) => {
		return await Options.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					name: {
						[Op.like]: `%${searchParams.searchTxt}%`,
					},
				}),
				is_deleted: false,
			},
			attributes: ["id", "name", "details"],
			order: [["name", "ASC"]],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any) => {
		return await Options.findOne({
			where: searchObject,
			attributes: ["id", "name", "details"],
		});
	};

	public create = async (optionsData: OptionsDTO) => {
		return await Options.create(optionsData).then(() => {
			return "Option created successfully";
		});
	};

	public edit = async (optionsId: string, optionsData: OptionsDTO) => {
		return await Options.update(optionsData, { where: { id: optionsId } }).then(() => {
			return "Option updated successfully";
		});
	};

	public delete = async (optionsId: string, userId: string) => {
		return await Options.update({ is_deleted: true, last_updated_by: userId }, { where: { id: optionsId } });
	};
}
