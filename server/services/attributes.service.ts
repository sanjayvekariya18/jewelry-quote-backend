import { Op, Transaction } from "sequelize";
import { Attributes, AttributesOptions, AttributesOptionsInput, Options } from "../models";
import { AttributesDTO, SearchAttributesDTO } from "../dto";
import { executeTransaction } from "../config/database";

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
			distinct: true,
			attributes: ["id", "name", "details"],
			include: [
				{
					model: AttributesOptions,
					attributes: ["id", "attribute_id", "option_id", "position"],
					include: [{ model: Options, attributes: ["id", "name", "details"] }],
				},
			],
			order: [
				["name", "ASC"],
				[AttributesOptions, "position", "ASC"],
			],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findOne = async (searchObject: any) => {
		return await Attributes.findOne({
			where: searchObject,
			attributes: ["id", "name", "details"],
			include: [
				{
					model: AttributesOptions,
					attributes: ["id", "attribute_id", "option_id", "position"],
					include: [{ model: Options, attributes: ["id", "name", "details"] }],
				},
			],
			order: [[AttributesOptions, "position", "ASC"]],
		});
	};

	public create = async (attributes: AttributesDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Attributes.create(attributes, { transaction }).then(async (attributeData) => {
				const assignAttributesOptions: Array<AttributesOptionsInput> = attributes.options.map((option_id, i) => {
					return {
						attribute_id: attributeData.id,
						option_id: option_id,
						position: i + 1,
						last_updated_by: attributes.last_updated_by,
					} as AttributesOptionsInput;
				});
				await AttributesOptions.bulkCreate(assignAttributesOptions, { transaction });
				return "Attribute created successfully";
			});
		});
	};

	public edit = async (attribute_id: string, attributes: AttributesDTO) => {
		await executeTransaction(async (transaction: Transaction) => {
			await AttributesOptions.destroy({ where: { attribute_id: attribute_id }, transaction });
			return await Attributes.update(attributes, { where: { id: attribute_id }, transaction }).then(async () => {
				const assignAttributesOptions: Array<AttributesOptionsInput> = attributes.options.map((option_id, i) => {
					return {
						attribute_id: attribute_id,
						option_id,
						position: i + 1,
						last_updated_by: attributes.last_updated_by,
					} as AttributesOptionsInput;
				});
				await AttributesOptions.bulkCreate(assignAttributesOptions, { transaction });
				return "Attribute updated successfully";
			});
		});
	};

	public delete = async (attribute_id: string, loggedInUserId: string) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Attributes.update({ is_deleted: true, last_updated_by: loggedInUserId }, { where: { id: attribute_id }, transaction }).then(
				async () => {
					await AttributesOptions.destroy({ where: { attribute_id: attribute_id }, transaction });
				}
			);
		});
	};
}
