import { Op, Transaction } from "sequelize";
import { CreateSubCategoryDTO, EditSubCategoryDTO, SearchSubCategoryDTO } from "../dto";
import { Category, SubCategory } from "../models";
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
				...(searchParams.categoryId && {
					category_id: searchParams.categoryId,
				}),
				is_deleted: false,
			},

			include: [
				{
					model: Category,
					attributes: [],
				},
			],
			order: [["name", "ASC"]],
			attributes: ["id", "category_id", [this.Sequelize.col("Category.name"), "category_name"], "name", "details", "logo_url", "img_url"],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public getList = async (searchParams: any) => {
		return await SubCategory.findAll({
			where: {
				is_deleted: false,
			},
			attributes: ["id", "name"],
			order: [["name", "ASC"]],
		});
	};

	public subCategoriesData = async (searchParams?: any) => {
		return await SubCategory.findAll({
			where: {
				...searchParams,
				is_deleted: false,
			},
			attributes: ["id", "name"],
			order: [["name", "ASC"]],
		});
	};

	public findOne = async (searchObject: any) => {
		return await SubCategory.findOne({
			where: searchObject,
			attributes: ["id", "category_id", "name", "details", "logo_url", "img_url"],
		});
	};

	public getSubCategoryByCategory = async (category_id: string) => {
		return await SubCategory.findAll({
			where: {
				category_id,
				is_deleted: false,
			},
			raw: true,
			include: [{ model: Category, attributes: [] }],
			attributes: ["id", "name", "category_id", [this.Sequelize.col("Category.name"), "categoryName"], "details", "logo_url", "img_url"],
		});
	};

	public create = async (subcategoriesData: CreateSubCategoryDTO) => {
		return await SubCategory.create(subcategoriesData).then(() => {
			return "Subcategory created successfully";
		});
	};

	public edit = async (subcategoriesId: string, subcategoriesData: EditSubCategoryDTO) => {
		return await SubCategory.update(subcategoriesData, { where: { id: subcategoriesId } }).then(() => {
			return "Subcategory updated successfully";
		});
	};

	public delete = async (subcategoriesId: string, loggedInUserId: string) => {
		return await SubCategory.update({ is_deleted: true, last_updated_by: loggedInUserId }, { where: { id: subcategoriesId }, returning: true }).then(
			(data) => data[1][0]
		);
	};
}
