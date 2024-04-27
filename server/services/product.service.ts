import { Op, Transaction } from "sequelize";
import {
	Attributes,
	AttributesOptions,
	Options,
	ProductAttributeOptions,
	ProductAttributeOptionsInput,
	Products,
	SubCategory,
	SubCategoryAttributes,
} from "../models";
import { ProductDTO, ProductAttributesOptionsDTO, SearchProductDTO } from "../dto";
import { executeTransaction, sequelizeConnection } from "../config/database";

export default class ProductService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchProductDTO) => {
		return await Products.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					name: {
						[Op.like]: "%" + searchParams.searchTxt + "%",
					},
				}),
				...(searchParams.sub_category_id && {
					sub_category_id: searchParams.sub_category_id,
				}),
				...(searchParams.is_active != undefined && {
					is_active: searchParams.is_active,
				}),
				is_deleted: false,
			},

			include: [
				{
					model: SubCategory,
					attributes: [],
				},
				{
					model: ProductAttributeOptions,
				},
			],
			order: [["name", "ASC"]],
			attributes: [
				"id",
				"stock_id",
				"sub_category_id",
				[this.Sequelize.col("SubCategory.name"), "sub_category_name"],
				"name",
				"description",
				"is_active",
			],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any) => {
		return await Products.findOne({
			where: searchObject,
			attributes: [
				"id",
				"stock_id",
				"sub_category_id",
				[this.Sequelize.col("SubCategory.name"), "sub_category_name"],
				"name",
				"description",
				"is_active",
			],
			include: [
				{ model: SubCategory, attributes: [] },
				{
					model: ProductAttributeOptions,
					include: [
						{
							model: Attributes,
							attributes: ["id", "name", "details"],
							include: [{ model: AttributesOptions, attributes: ["id"], include: [{ model: Options, attributes: ["id", "name", "details"] }] }],
						},
					],
					attributes: ["id", "product_id", "attribute_id", "default_option"],
				},
			],
		});
	};

	public create = async (productData: ProductDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Products.create(productData).then(async (newProductData) => {
				let productAttributeOption1 = productData.attributeOptions.map((data) => {
					return { ...data, product_id: newProductData.id };
				});
				await ProductAttributeOptions.bulkCreate(productAttributeOption1, { ignoreDuplicates: true, transaction });
				return "Product Created Successfully";
			});
		});
	};

	public edit = async (product_id: string, productData: ProductDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Products.update(productData, { where: { id: product_id }, transaction }).then(async () => {
				// let productAttributeOption1 = productData.map((data) => {
				// 	return { ...data, product_id: product_id.id };
				// });
				// await ProductAttributeOptions.bulkCreate(productAttributeOption1, { ignoreDuplicates: true, transaction });

				return "Product Created Successfully";
			});
		});
	};

	public toggleProductActive = async (product_id: string, loggedInUserId: string) => {
		return await Products.update(
			{
				is_active: this.Sequelize.literal(`Not \`is_active\``),
				last_updated_by: loggedInUserId,
			},
			{ where: { id: product_id } }
		).then(async () => {
			return await this.findOne({ id: product_id });
		});
	};

	public delete = async (product_id: string, loggedInUserId: string) => {
		return await Products.update({ is_deleted: true, last_updated_by: loggedInUserId }, { where: { id: product_id } }).then(() => {
			return "Product Deleted Successfully";
		});
	};
}
