import { executeTransaction } from "../config/database";
import {
	AddToQuote,
	CustomerDetails,
	Products,
	QuotationAttributeOptions,
	QuotationAttributeOptionsInput,
	QuotationMaster,
	QuotationOtherDetail,
	QuotationOtherDetailInput,
	QuotationProduct,
	SubCategory,
} from "../models";
import { QuotationDTO, QuotationProductsDTO, SearchQuotationDTO } from "../dto";
import { Op, Transaction } from "sequelize";
import { QUOTATION_STATUS } from "../enum";

export default class QuotationService {
	public getAll = async (searchParams: SearchQuotationDTO) => {
		const data: any = await QuotationMaster.findAndCountAll({
			where: {
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
					attributes: ["id", "quotation_id", "product_id", "qty", "price", "notes"],
					include: [
						{
							model: Products,
							attributes: [
								"id",
								"stock_id",
								"sub_category_id",
								"name",
								"description",
								"metal_type",
								"style",
								"setting_type",
								"sub_setting",
								"prong_type",
								"shank_type",
								"band_type",
								"fit_type",
								"lock_type",
								"bail_type",
								"is_active",
							],
							include: [{ model: SubCategory, attributes: ["id", "category_id", "name", "details", "img_url", "logo_url"] }],
						},
						{ model: QuotationAttributeOptions, attributes: ["id", "quotation_product_id", "attribute_name", "option_name"] },
						{ model: QuotationOtherDetail, attributes: ["id", "quotation_product_id", "detail_name", "detail_value"] },
					],
				},
				{
					model: CustomerDetails,
					attributes: [
						"id",
						"company_name",
						"customer_name",
						"customer_email",
						"login_id",
						"country_code",
						"mobile_number",
						"wp_country_code",
						"whatsapp_number",
						"customer_address",
						"address_map_link",
						"city",
						"country",
						"zip_code",
						"website",
						"business_registration",
						"company_tax_number",
						"customer_business_card",
						"association_membership",
						"description_of_business",
						"customer_social_media",
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
		}).then((quotations) => {
			return { count: quotations.count, rows: quotations.rows.map((row) => row.get({ plain: true })) };
		});

		data.rows = data.rows.map((row: any) => {
			let price = 0;
			row.QuotationProducts.forEach((pro: any) => {
				price += pro.price || 0;
			});
			return { ...row, totalPrice: price };
		});

		return data;
	};

	public findOne = async (searchObject: any) => {
		const data: any = await QuotationMaster.findOne({
			where: { ...searchObject },
			attributes: ["id", "customer_id", "quotation_date", "status"],
			include: [
				{
					model: QuotationProduct,
					attributes: ["id", "quotation_id", "product_id", "qty", "price", "notes"],
					include: [
						{
							model: Products,
							attributes: [
								"id",
								"stock_id",
								"sub_category_id",
								"name",
								"description",
								"metal_type",
								"style",
								"setting_type",
								"sub_setting",
								"prong_type",
								"shank_type",
								"band_type",
								"fit_type",
								"lock_type",
								"bail_type",
							],
							include: [{ model: SubCategory, attributes: ["id", "category_id", "name", "details", "img_url", "logo_url"] }],
						},
						{ model: QuotationAttributeOptions, attributes: ["id", "quotation_product_id", "attribute_name", "option_name"] },
						{ model: QuotationOtherDetail, attributes: ["id", "quotation_product_id", "detail_name", "detail_value"] },
					],
				},
				{
					model: CustomerDetails,
					attributes: [
						"id",
						"company_name",
						"customer_name",
						"customer_email",
						"login_id",
						"country_code",
						"mobile_number",
						"wp_country_code",
						"whatsapp_number",
						"customer_address",
						"address_map_link",
						"city",
						"country",
						"zip_code",
						"website",
						"business_registration",
						"company_tax_number",
						"customer_business_card",
						"association_membership",
						"description_of_business",
						"customer_social_media",
						"is_active",
					],
				},
			],
		}).then((data1) => data1?.get({ plain: true }));

		let price = 0;
		if (data == null) return null;
		data.QuotationProducts.forEach((pro: any) => {
			price += pro.price || 0;
		});
		return { ...data, totalPrice: price };
	};

	public simpleFindOne = async (searchObject: any) => {
		return await QuotationMaster.findOne({
			where: { ...searchObject },
			attributes: ["id", "customer_id", "quotation_date", "status"],
		});
	};

	public placeQuotation = async (quotationData: QuotationDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await QuotationMaster.create(quotationData, { transaction }).then(async (quotation) => {
				const quotationProducts: Array<QuotationProductsDTO> = quotationData.quotationProducts.map((quoPro) => {
					return {
						product_id: quoPro.product_id,
						qty: quoPro.qty,
						quotation_id: quotation.id,
						notes: quoPro.notes,
						attributeOptions: quoPro.attributeOptions,
						otherDetails: quoPro.otherDetails,
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

						const otherDetails: Array<QuotationOtherDetailInput> = quoProduct.otherDetails.map((quoPro) => {
							return {
								quotation_product_id: products.id,
								detail_name: quoPro.detail_name,
								detail_value: quoPro.detail_value,
							} as QuotationOtherDetailInput;
						});
						await QuotationOtherDetail.bulkCreate(otherDetails, { transaction });
					});
				}

				await AddToQuote.destroy({ where: { customer_id: quotationData.customer_id } });
				return "Quotation created successfully";
			});
		});
	};

	public changeProductPrice = async (quotation_product_id: string, price: number) => {
		return await QuotationProduct.update({ price }, { where: { id: quotation_product_id } }).then(() => {
			return "Quotation Product Price changed successfully";
		});
	};

	public changeStatus = async (quotation_id: string, status: QUOTATION_STATUS) => {
		return await QuotationMaster.update({ status }, { where: { id: quotation_id } }).then(() => {
			return "Quotation Status changed successfully";
		});
	};

	public delete = async (quotation_id: string) => {
		return await QuotationMaster.destroy({ where: { id: quotation_id } });
	};
}
