import { executeTransaction, sequelizeConnection } from "../config/database";
import {
	AddToQuote,
	CustomerDetails,
	Products,
	QuotationAttributeOptions,
	QuotationAttributeOptionsInput,
	QuotationMaster,
	QuotationProduct,
	SubCategory,
} from "../models";
import { QuotationDTO, QuotationProductsDTO, SearchQuotationDTO } from "../dto";
import { Op, Transaction } from "sequelize";
import { QUOTATION_STATUS } from "../enum";

export default class QuotationService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchQuotationDTO) => {
		return await QuotationMaster.findAndCountAll({
			where: {
				// ...(searchParams.searchTxt && {
				// 	[Op.or]: [{ name: { [Op.like]: `%${searchParams.searchTxt}%` } }],
				// }),
				...(searchParams.from_date &&
					searchParams.to_date && {
						quotation_date: { [Op.between]: [searchParams.from_date, searchParams.to_date] },
					}),
				...(searchParams.status && {
					status: searchParams.status,
				}),
				...(searchParams.customer_id && {
					customer_id: searchParams.customer_id,
				}),
			},
			distinct: true,
			include: [
				{
					model: QuotationProduct,
					attributes: ["id", "quotation_id", "product_id", "qty", "styleMaster"],
					include: [
						{
							model: Products,
							attributes: ["id", "stock_id", "sub_category_id", "name", "description"],
							include: [{ model: SubCategory, attributes: ["id", "category_id", "name", "details", "img_url", "logo_url"] }],
						},
						{ model: QuotationAttributeOptions, attributes: ["id", "quotation_product_id", "attribute_name", "option_name"] },
					],
				},
				{
					model: CustomerDetails,
					attributes: [
						"id",
						"customer_name",
						"customer_email",
						"login_id",
						"country_code",
						"mobile_number",
						"whatsapp_number",
						"customer_address",
						"website",
						"business_registration",
						"customer_fax",
						"customer_business_card",
						"association_membership",
						"customer_social_media",
						"business_reference",
						"is_active",
					],
				},
			],
			order: [["createdAt", "DESC"]],
			attributes: ["id", "customer_id", "quotation_date", "status", "createdAt"],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any) => {
		return await QuotationMaster.findOne({
			where: { ...searchObject },
			attributes: ["id", "customer_id", "quotation_date", "status", "notes"],
		});
	};

	public placeQuotation = async (categoryData: QuotationDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await QuotationMaster.create(categoryData, { transaction }).then(async (quotation) => {
				const quotationProducts: Array<QuotationProductsDTO> = categoryData.quotationProducts.map((quoPro) => {
					return {
						product_id: quoPro.product_id,
						qty: quoPro.qty,
						quotation_id: quotation.id,
						attributeOptions: quoPro.attributeOptions,
						styleMaster: quoPro.styleMaster,
					} as QuotationProductsDTO;
				});
				for await (const quoProduct of quotationProducts) {
					await QuotationProduct.create(quoProduct, { transaction }).then(async (products) => {
						const attributeOptions: Array<QuotationAttributeOptionsInput> = quoProduct.attributeOptions.map((quoPro) => {
							return {
								quotation_product_id: products.id,
								attribute_name: quoPro.attribute_name,
								option_name: quoPro.option_name,
							} as QuotationAttributeOptionsInput;
						});

						await QuotationAttributeOptions.bulkCreate(attributeOptions, { transaction });
					});
				}

				await AddToQuote.destroy({ where: { customer_id: categoryData.customer_id } });
				return "Quotation created successfully";
			});
		});
	};

	public changeStatus = async (quotation_id: string, status: QUOTATION_STATUS) => {
		return await QuotationMaster.update({ status }, { where: { id: quotation_id } });
	};

	public delete = async (quotation_id: string) => {
		return await QuotationMaster.destroy({ where: { id: quotation_id } });
	};
}
