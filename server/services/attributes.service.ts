import { Op } from "sequelize";
import { Attributes } from "../models";
import { AttributesDTO, SearchAttributesDTO } from "../dto";

export default class AttributesService {
	public getAll = async (searchParams: SearchAttributesDTO) => {
		return await Attributes.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					name: {
						[Op.like]: `%${searchParams.searchTxt}%`,
					},
				}),
				is_deleted: false,
			},
			order: [["name", "ASC"]],
			attributes: ["id", "name", "details"],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findOne = async (searchObject: any) => {
		return await Attributes.findOne({
			where: searchObject,
			attributes: ["id", "name", "details"],
		});
	};

	public create = async (attributes: AttributesDTO) => {
		return await Attributes.create(attributes).then(() => {
			return "Attribute created successfully";
		});
	};

	public edit = async (attributesId: string, attributes: AttributesDTO) => {
		return await Attributes.update(attributes, { where: { id: attributesId } }).then(() => {
			return "Attribute updated successfully";
		});
	};

	public delete = async (attributesId: string, loggedInUserId: string) => {
		return await Attributes.update({ is_deleted: true, last_updated_by: loggedInUserId }, { where: { id: attributesId } });
	};
}
