import { Transaction } from "sequelize";
import { executeTransaction, sequelizeConnection } from "../config/database";
import { CatalogMaster, CatalogProducts, Category } from "../models";
import { CategoryDTO, CreateCatalogDTO, SearchCatalogDTO, SearchCategoryDTO } from "../dto";
import { Op } from "sequelize";

export default class CatalogService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchCatalogDTO) => {
		return await CatalogMaster.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					[Op.or]: [{ name: { [Op.like]: `%${searchParams.searchTxt}%` } }],
				}),
				is_deleted: false,
			},
			order: [["name", "ASC"]],
			attributes: ["id", "name", "description", "img_url", "pdf_url", "is_active"],
			include: [{ model: CatalogProducts }],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any) => {
		return await CatalogMaster.findOne({
			where: { ...searchObject, is_deleted: false },
			attributes: ["id", "name", "description", "img_url", "pdf_url", "is_active"],
			include: [{ model: CatalogProducts }],
		});
	};

	public create = async (categoryData: CreateCatalogDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await CatalogMaster.create(categoryData, { transaction }).then(async (data) => {
				let catPro = categoryData.catalog_products.map((product_id) => {
					return {
						catalog_id: data.id,
						product_id,
						last_updated_by: categoryData.last_updated_by,
					};
				});

				await CatalogProducts.bulkCreate(catPro, { ignoreDuplicates: true, transaction });
				return "Catalog Master created successfully";
			});
		});
	};

	public edit = async (catalog_id: string, categoryData: CreateCatalogDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			await CatalogProducts.destroy({ where: { catalog_id } });
			return await CatalogMaster.update(categoryData, { where: { id: catalog_id }, transaction }).then(async () => {
				let catPro = categoryData.catalog_products.map((product_id) => {
					return {
						catalog_id,
						product_id,
						last_updated_by: categoryData.last_updated_by,
					};
				});

				await CatalogProducts.bulkCreate(catPro, { ignoreDuplicates: true, transaction });
				return "Catalog Master updated successfully";
			});
		});
	};

	public delete = async (catalog_id: string, loggedInUserId: string) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await CatalogMaster.update({ is_deleted: true, last_updated_by: loggedInUserId }, { where: { id: catalog_id }, transaction }).then(
				async () => {
					await CatalogProducts.update({ is_deleted: true, last_updated_by: loggedInUserId }, { where: { catalog_id: catalog_id }, transaction });
				}
			);
		});
	};
}
