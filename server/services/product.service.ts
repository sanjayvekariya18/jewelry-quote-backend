import { Op, Transaction } from "sequelize";
import {
	Attributes,
	AttributesOptions,
	Options,
	OtherDetailMaster,
	ProductAttributeOptions,
	ProductOtherDetail,
	Products,
	SubCategory,
} from "../models";
import { ProductDTO, SearchProductDTO } from "../dto";
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
			distinct: true,
			include: [
				{
					model: SubCategory,
					attributes: ["id", "name"],
				},
				{
					model: ProductAttributeOptions,
					attributes: ["id", "product_id", "attribute_id", "option_id"],
					include: [
						{
							model: Attributes,
							attributes: ["id", "name", "details"],
							include: [{ model: AttributesOptions, attributes: ["id"], include: [{ model: Options, attributes: ["id", "name", "details"] }] }],
						},
						{
							model: Options,
							attributes: ["id", "name"],
						},
					],
				},
				{
					model: ProductOtherDetail,
					attributes: ["id", "product_id", "other_detail_id", "detail_value"],
					include: [{ model: OtherDetailMaster, attributes: ["id", "detail_name", "detail_type"] }],
				},
			],
			order: [["name", "ASC"]],
			attributes: [
				"id",
				"stock_id",
				"sub_category_id",
				// [this.Sequelize.col("SubCategory.name"), "sub_category_name"],
				"name",
				"description",
				"is_active",
				// [
				// 	this.Sequelize.literal(`(
				//         CASE WHEN
				//             (select
				//                 "product_id"."product_id"
				//             from
				//                 "wishListGemstone"
				//             where
				//                 "customerId" = ${customerId} and "wishListGemstone"."gemstoneId" = "Gemstone"."id") IS NOT NULL
				//         THEN true ELSE false END)
				//     `),
				// 	"isAddedToWishList",
				// ],
			],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public getAllForCustomer = async (searchParams: SearchProductDTO) => {
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
				is_deleted: false,
			},
			distinct: true,
			include: [
				{
					model: SubCategory,
					attributes: ["id", "name"],
				},
				{
					model: ProductAttributeOptions,
					attributes: ["id", "product_id", "attribute_id", "option_id"],
					include: [
						{
							model: Attributes,
							attributes: ["id", "name", "details"],
							include: [{ model: AttributesOptions, attributes: ["id"], include: [{ model: Options, attributes: ["id", "name", "details"] }] }],
						},
						{
							model: Options,
							attributes: ["id", "name"],
						},
					],
				},
				{
					model: ProductOtherDetail,
					attributes: ["id", "product_id", "other_detail_id", "detail_value"],
					include: [{ model: OtherDetailMaster, attributes: ["id", "detail_name", "detail_type"] }],
				},
			],
			order: [["name", "ASC"]],
			attributes: [
				"id",
				"stock_id",
				"sub_category_id",
				// [this.Sequelize.col("SubCategory.name"), "sub_category_name"],
				"name",
				"description",
			],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any) => {
		const data: any = await Products.findOne({
			where: searchObject,
			attributes: [
				"id",
				"stock_id",
				"sub_category_id",
				// [this.Sequelize.col("SubCategory.name"), "sub_category_name"],
				"name",
				"description",
				"is_active",
			],
			include: [
				{ model: SubCategory, attributes: ["id", "name"] },
				{
					model: ProductAttributeOptions,
					include: [
						{
							model: Attributes,
							attributes: ["id", "name", "details"],
							include: [{ model: AttributesOptions, attributes: ["id"], include: [{ model: Options, attributes: ["id", "name", "details"] }] }],
						},
						{
							model: Options,
							attributes: ["id", "name"],
						},
					],
					attributes: ["id", "product_id", "attribute_id", "option_id"],
				},
				{
					model: ProductOtherDetail,
					attributes: ["id", "product_id", "other_detail_id", "detail_value"],
					include: [{ model: OtherDetailMaster, attributes: ["id", "detail_name", "detail_type"] }],
				},
			],
		}).then((data) => data?.get({ plain: true }));

		let resp: Array<any> = [];
		if (data?.ProductAttributeOptions) {
			for (const data1 of data.ProductAttributeOptions) {
				resp.push({
					attribute_id: data1.Attribute.id,
					attribute_name: data1.Attribute.name,
					option_id: data1.Option.id,
					option_name: data1.Option.name,
					options: data1.Attribute.AttributesOptions,
				});
			}
		}
		return { ...data, ProductAttributeOptions: resp };
	};

	public simpleFindOne = async (searchObject: any) => {
		return await Products.findOne({
			where: searchObject,
			attributes: ["id", "stock_id", "sub_category_id", "name", "description", "is_active"],
		});
	};

	public create = async (productData: ProductDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await Products.create(productData, { transaction }).then(async (newProductData) => {
				let productAttributeOption1 = productData.attributeOptions.map((data) => {
					return { ...data, product_id: newProductData.id };
				});
				await ProductAttributeOptions.bulkCreate(productAttributeOption1, { ignoreDuplicates: true, transaction });

				let productOtherDetails = productData.otherDetails.map((data) => {
					return { ...data, product_id: newProductData.id };
				});
				await ProductOtherDetail.bulkCreate(productOtherDetails, { ignoreDuplicates: true, transaction });

				return "Product Created Successfully";
			});
		});
	};

	public edit = async (product_id: string, productData: ProductDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			await ProductAttributeOptions.destroy({ where: { product_id }, transaction });
			return await Products.update(productData, { where: { id: product_id }, transaction }).then(async () => {
				let productAttributeOption1 = productData.attributeOptions.map((data) => {
					return { ...data, product_id };
				});
				await ProductAttributeOptions.bulkCreate(productAttributeOption1, { ignoreDuplicates: true, transaction });

				return "Product Edited Successfully";
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
		return await executeTransaction(async (transaction: Transaction) => {
			return await Products.update({ is_deleted: true, last_updated_by: loggedInUserId }, { where: { id: product_id }, transaction }).then(
				async () => {
					await ProductAttributeOptions.update({ is_deleted: false, last_updated_by: loggedInUserId }, { where: { product_id }, transaction });
					return "Product Deleted Successfully";
				}
			);
		});
	};
}
