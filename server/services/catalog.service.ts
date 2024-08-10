import { QueryTypes, Transaction } from "sequelize";
import { executeTransaction, sequelizeConnection } from "../config/database";
import { Attributes, CatalogMaster, CatalogProducts, Options, ProductAttributeOptions, Products, SubCategory } from "../models";
import { CreateCatalogDTO, SearchCatalogDTO, SearchCustomerCatalogDTO } from "../dto";
import { Op } from "sequelize";
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";

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
			distinct: true,
			order: [["name", "ASC"]],
			attributes: ["id", "name", "description", "img_url", "pdf_url", "is_active"],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public getAllForCustomer = async (searchParams: SearchCustomerCatalogDTO) => {
		let query = `
        SELECT
            cm.id,
            cm.name,
            cm.description ,
            cm.img_url ,
            cm.pdf_url ,
            (IF (COUNT(cp.id) > 0,true,false)) AS has_any_product
        FROM
            catalog_master cm
        LEFT JOIN catalog_products cp ON
            cp.catalog_id = cm.id
        WHERE
            (:searchTxt is null or cm.name like '%:searchTxt%') AND 
            cm.is_deleted = false AND 
            cm.is_active = true
        GROUP BY
            cm.id,
            cm.name,
            cm.description ,
            cm.img_url ,
            cm.pdf_url
        HAVING has_any_product = ${searchParams.show_live_products}
        `;

		const countData: any[] = await sequelizeConnection.query(
			`SELECT
                cm.id,
                cm.name,
                cm.description ,
                cm.img_url ,
                cm.pdf_url ,
                (IF (COUNT(cp.id) > 0,true,false)) AS has_any_product
            FROM catalog_master cm
            LEFT JOIN catalog_products cp ON
                cp.catalog_id = cm.id
            WHERE
                (:searchTxt IS NULL OR cm.name LIKE '%:searchTxt%') AND 
                cm.is_deleted = false AND 
                cm.is_active = true
            GROUP BY
                cm.id,
                cm.name,
                cm.description ,
                cm.img_url ,
                cm.pdf_url
            HAVING has_any_product = ${searchParams.show_live_products};`,
			{
				replacements: { searchTxt: searchParams.searchTxt || null },
				type: QueryTypes.SELECT,
			}
		);

		if (searchParams.page != undefined && searchParams.rowsPerPage != undefined) {
			query += `limit ${searchParams.page * searchParams.rowsPerPage},${searchParams.rowsPerPage};`;
		}

		const data = await sequelizeConnection.query(query, {
			replacements: { searchTxt: searchParams.searchTxt || null },
			type: QueryTypes.SELECT,
		});

		return { count: countData.length, rows: data };
	};

	public findOne = async (searchObject: any) => {
		return await CatalogMaster.findOne({
			where: { ...searchObject, is_deleted: false },
			attributes: ["id", "name", "description", "img_url", "pdf_url", "is_active"],
			include: [
				{
					model: CatalogProducts,
					attributes: ["id", "catalog_id", "product_id"],
					include: [
						{
							model: Products,
							attributes: ["id", "stock_id", "sub_category_id", "name", "description"],
							include: [
								{ model: SubCategory, attributes: ["id", "category_id", "name", "details", "img_url", "logo_url"] },
								{
									model: ProductAttributeOptions,
									attributes: ["id", "product_id", "attribute_id", "option_id"],
									include: [
										{ model: Attributes, attributes: ["id", "name"] },
										{ model: Options, attributes: ["id", "name"] },
									],
								},
							],
						},
					],
				},
			],
		});
	};

	public findOneForCustomer = async (searchObject: any, customer_id: string) => {
		return await CatalogMaster.findOne({
			where: { ...searchObject, is_active: true, is_deleted: false },
			attributes: ["id", "name", "description", "img_url", "pdf_url", "is_active"],
			include: [
				{
					model: CatalogProducts,
					attributes: ["id", "catalog_id", "product_id"],
					include: [
						{
							model: Products,
							attributes: [
								"id",
								"stock_id",
								"sub_category_id",
								"name",
								"description",
								[
									this.Sequelize.literal(`(
                                        CASE WHEN
                                            (select product_id from wishlist
                                            where
                                                customer_id = '${customer_id}' and wishlist.product_id = \`CatalogProducts->Product\`.id
                                            limit 1)
                                        IS NOT NULL THEN true ELSE false END)
                                    `),
									"isAddedToWishList",
								],
							],
							include: [
								{ model: SubCategory, attributes: ["id", "category_id", "name", "details", "img_url", "logo_url"] },
								{
									model: ProductAttributeOptions,
									attributes: ["id", "product_id", "attribute_id", "option_id"],
									include: [
										{ model: Attributes, attributes: ["id", "name"] },
										{ model: Options, attributes: ["id", "name"] },
									],
								},
							],
						},
					],
				},
			],
		});
	};

	public create = async (categoryData: CreateCatalogDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await CatalogMaster.create(categoryData, { transaction }).then(async (data) => {
				if (categoryData.catalog_products && categoryData.catalog_products.length > 0) {
					let catPro = categoryData.catalog_products.map((product_id) => {
						return {
							catalog_id: data.id,
							product_id,
							last_updated_by: categoryData.last_updated_by,
						};
					});

					await CatalogProducts.bulkCreate(catPro, { ignoreDuplicates: true, transaction });
				}
				return "Catalog Master created successfully";
			});
		});
	};

	public edit = async (catalog_id: string, categoryData: CreateCatalogDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await CatalogMaster.update(categoryData, { where: { id: catalog_id }, transaction }).then(async () => {
				await CatalogProducts.destroy({ where: { catalog_id }, transaction });
				if (categoryData.catalog_products && categoryData.catalog_products.length > 0) {
					let catPro = categoryData.catalog_products.map((product_id) => {
						return {
							catalog_id,
							product_id,
							last_updated_by: categoryData.last_updated_by,
						};
					});

					await CatalogProducts.bulkCreate(catPro, { ignoreDuplicates: true, transaction });
				}
				return "Catalog Master updated successfully";
			});
		});
	};

	public toggleCatalogActive = async (catalogId: string, loggedInUserId: string) => {
		return await CatalogMaster.update(
			{
				is_active: this.Sequelize.literal(`Not \`is_active\``),
				last_updated_by: loggedInUserId,
			},
			{ where: { id: catalogId } }
		).then(async () => {
			return await this.findOne({ id: catalogId });
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
