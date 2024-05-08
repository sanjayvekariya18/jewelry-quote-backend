import { Transaction } from "sequelize";
import { executeTransaction } from "../config/database";
import { CreateAddToQuoteDTO, EditAddToQuoteDTO } from "../dto";
import {
	ATQAttributeOptions,
	ATQAttributeOptionsInput,
	ATQOtherDetail,
	ATQOtherDetailInput,
	AddToQuote,
	Attributes,
	AttributesOptions,
	Category,
	Options,
	OtherDetailMaster,
	Products,
	SubCategory,
} from "../models";

export default class AddToQuoteService {
	public getAll = async (customer_id: string) => {
		return await AddToQuote.findAll({
			where: {
				customer_id,
			},
			include: [
				{
					model: Products,
					attributes: ["id", "stock_id", "sub_category_id", "name", "description"],
					include: [
						{
							model: SubCategory,
							attributes: ["id", "category_id", "name", "details", "img_url", "logo_url"],
							include: [{ model: Category, attributes: ["id", "name", "details", "img_url", "logo_url"] }],
						},
					],
				},
				{
					model: ATQAttributeOptions,
					attributes: ["id"],
					include: [
						{
							model: Attributes,
							attributes: ["id", "name", "details"],
							include: [{ model: AttributesOptions, attributes: ["id"], include: [{ model: Options, attributes: ["id", "name", "details"] }] }],
						},
						{ model: Options, attributes: ["id", "name", "details"] },
					],
				},
				{ model: ATQOtherDetail, attributes: ["id", "add_to_quote_id", "detail_name", "detail_value"] },
			],
			attributes: ["id", "product_id", "customer_id", "qty", "notes"],
			order: [["createdAt", "DESC"]],
			// raw: true,
		});
	};

	public getATQTotalCount = async (customer_id: string) => {
		return AddToQuote.count({
			where: {
				customer_id,
			},
		});
	};

	public findOne = async (searchParams: any) => {
		return await AddToQuote.findOne({
			where: searchParams,
		});
	};

	public create = async (quoteData: CreateAddToQuoteDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await AddToQuote.create(quoteData, { transaction }).then(async (data) => {
				const assignAttributesOptions: Array<ATQAttributeOptionsInput> = quoteData.attributeOptions.map((attOpt) => {
					return {
						add_to_quote_id: data.id,
						attribute_id: attOpt.attribute_id,
						option_id: attOpt.option_id,
					} as ATQAttributeOptionsInput;
				});
				await ATQAttributeOptions.bulkCreate(assignAttributesOptions, { transaction });
				const assignOtherDetails: Array<ATQOtherDetailInput> = quoteData.otherDetails.map((othDet) => {
					return {
						add_to_quote_id: data.id,
						detail_name: othDet.detail_name,
						detail_value: othDet.detail_value,
					} as ATQOtherDetailInput;
				});
				await ATQOtherDetail.bulkCreate(assignOtherDetails, { transaction });
				return "Product Added";
			});
		});
	};

	public edit = async (quoteId: string, quoteData: EditAddToQuoteDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await AddToQuote.update(quoteData, { where: { id: quoteId }, transaction }).then(async () => {
				return "Product Edited";
			});
		});
	};

	public delete = async (ATQId: string) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await AddToQuote.destroy({ where: { id: ATQId }, transaction }).then(async () => {
				await ATQAttributeOptions.destroy({ where: { add_to_quote_id: ATQId }, transaction });
			});
		});
	};

	public deleteATQByCustomerId = async (customer_id: string) => {
		return await AddToQuote.destroy({ where: { customer_id } });
	};
}
