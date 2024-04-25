import { Op } from "sequelize";
import { CreateSubCategoryDTO, EditSubCategoryDTO, SearchSubCategoryDTO } from "../dto";
import { Category, SubCategory } from "../models";
import { sequelizeConnection } from "../config/database";

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

			include: [{ model: Category, attributes: [] }],
			order: [["name", "ASC"]],
			attributes: ["id", "name", "details", "logo_url", "img_url", "category_id", [this.Sequelize.col("Category.name"), "category_name"]],
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
			include: [{ model: Category, attributes: [] }],
			attributes: ["id", "name", "details", "logo_url", "img_url", "category_id", [this.Sequelize.col("Category.name"), "category_name"]],
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
			attributes: ["id", "name", "details", "logo_url", "img_url", "category_id", [this.Sequelize.col("Category.name"), "categoryName"]],
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
		return await SubCategory.update({ is_deleted: true, last_updated_by: loggedInUserId }, { where: { id: subcategoriesId } });
	};
}
