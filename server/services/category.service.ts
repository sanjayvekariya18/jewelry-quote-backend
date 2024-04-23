import { Transaction } from "sequelize";
import { executeTransaction, sequelizeConnection } from "../config/database";
import { Category } from "../models";
import { CategoryDTO, SearchCategoryDTO } from "../dto";

export default class CategoryService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchCategoryDTO) => {
		return await Category.findAndCountAll({
			where: { is_deleted: false },
			order: [["name", "ASC"]],
			attributes: ["id", "name", "details", "img_url", "logo_url"],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any) => {
		return await Category.findOne({
			where: { ...searchObject, is_deleted: false },
			attributes: ["id", "name", "details", "img_url", "logo_url"],
		});
	};

	public getCategoryDetails = async (category_id: string) => {
		const categoryData = await Category.findOne({
			where: {
				id: category_id,
			},
			attributes: ["id", "name", "details", "img_url", "logo_url"],
			raw: true,
		});
		return categoryData;
	};

	public create = async (categoryData: CategoryDTO) => {
		return await Category.create(categoryData).then(() => {
			return "Category created successfully";
		});
	};

	public edit = async (categoryId: string, categoryData: CategoryDTO) => {
		return await Category.update(categoryData, { where: { id: categoryId } }).then(() => {
			return "Category updated successfully";
		});
	};

	public delete = async (categoryId: string, userId: string) => {
		return await Category.update({ is_deleted: true, last_updated_by: userId }, { where: { id: categoryId } });
	};
}
