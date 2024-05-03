import { Op, Transaction } from "sequelize";
import { CreateSubCategoryDTO, EditSubCategoryDTO, SearchSubCategoryDTO } from "../dto";
import { Attributes, AttributesOptions, Category, Options, SubCategory, SubCategoryAttributes, SubCategoryAttributesAttribute } from "../models";
import { executeTransaction, sequelizeConnection } from "../config/database";

export default class SubcategoryService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchSubCategoryDTO) => {
		return await SubCategory.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					name: {
						[Op.like]: "%" + searchParams.searchTxt + "%",
					},
				}),
				...(searchParams.category_id && {
					category_id: searchParams.category_id,
				}),
				is_deleted: false,
			},

			include: [{ model: Category, attributes: ["id", "name"] }],
			order: [["name", "ASC"]],
			attributes: [
				"id",
				"name",
				"details",
				"logo_url",
				"img_url",
				"category_id",
				//  [this.Sequelize.col("Category.name"), "category_name"]
			],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any) => {
		return await SubCategory.findOne({
			where: searchObject,
			include: [
				{ model: Category, attributes: ["id", "name"] },
				{ model: SubCategoryAttributes, include: [{ model: Attributes, attributes: ["id", "name", "details"] }] },
			],
			attributes: [
				"id",
				"name",
				"details",
				"logo_url",
				"img_url",
				"category_id",
				// [this.Sequelize.col("Category.name"), "category_name"]
			],
		});
	};

	public simpleFindOne = async (searchObject: any) => {
		return await SubCategory.findOne({
			where: searchObject,
			attributes: ["id", "name", "details", "logo_url", "img_url", "category_id"],
		});
	};

	public getSubCategoryByCategory = async (category_id: string) => {
		return await SubCategory.findAll({
			where: {
				category_id,
				is_deleted: false,
			},
			raw: true,
			include: [{ model: Category, attributes: ["id", "name"] }],
			attributes: [
				"id",
				"name",
				"details",
				"logo_url",
				"img_url",
				"category_id",
				//  [this.Sequelize.col("Category.name"), "categoryName"]
			],
		});
	};

	public getSubCategoryAttributes = async (sub_category_id: string) => {
		const data: any = await SubCategory.findOne({
			where: { id: sub_category_id },
			attributes: ["id", "category_id", "name", "details", "img_url", "logo_url"],
			include: [
				{
					model: SubCategoryAttributes,
					attributes: ["id"],
					include: [
						{
							model: Attributes,
							attributes: ["id", "name", "details"],
							include: [{ model: AttributesOptions, attributes: ["id"], include: [{ model: Options, attributes: ["id", "name"] }] }],
						},
					],
				},
			],
		});

		let resp: Array<any> = [];
		for (const data1 of data.SubCategoryAttributes) {
			resp.push({
				id: data1.Attribute.id,
				attribute_name: data1.Attribute.name,
				options: data1.Attribute.AttributesOptions,
			});
		}
		return resp;
	};

	public create = async (subcategoriesData: CreateSubCategoryDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await SubCategory.create(subcategoriesData, { transaction }).then(async (data) => {
				const categoryAttributes: Array<SubCategoryAttributesAttribute> = subcategoriesData.attributes.map((attribute_id) => {
					return {
						sub_category_id: data.id,
						attribute_id: attribute_id,
						last_updated_by: subcategoriesData.last_updated_by,
					} as SubCategoryAttributesAttribute;
				});
				if (categoryAttributes && categoryAttributes.length > 0) {
					await SubCategoryAttributes.bulkCreate(categoryAttributes, { ignoreDuplicates: true, transaction });
				}
				return "Subcategory created successfully";
			});
		});
	};

	public edit = async (sub_category_id: string, subcategoriesData: EditSubCategoryDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await SubCategory.update(subcategoriesData, { where: { id: sub_category_id }, transaction }).then(async () => {
				if (subcategoriesData.attributes.length > 0) {
					await SubCategoryAttributes.destroy({ where: { sub_category_id }, transaction }).then(async () => {
						const categoryAttributes: Array<SubCategoryAttributesAttribute> = subcategoriesData.attributes.map((attribute_id) => {
							return {
								sub_category_id: sub_category_id,
								attribute_id: attribute_id,
								last_updated_by: subcategoriesData.last_updated_by,
							} as SubCategoryAttributesAttribute;
						});
						if (categoryAttributes && categoryAttributes.length > 0) {
							await SubCategoryAttributes.bulkCreate(categoryAttributes, { ignoreDuplicates: true, transaction });
						}
					});
				}
				return "Subcategory updated successfully";
			});
		});
	};

	public delete = async (subcategoriesId: string, loggedInUserId: string) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await SubCategory.update({ is_deleted: true, last_updated_by: loggedInUserId }, { where: { id: subcategoriesId }, transaction }).then(
				async () => {
					await SubCategoryAttributes.destroy({ where: { sub_category_id: subcategoriesId }, transaction });
				}
			);
		});
	};
}
