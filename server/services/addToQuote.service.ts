import { Transaction } from "sequelize";
import { executeTransaction } from "../config/database";
import { CreateAddToQuoteDTO } from "../dto";
import {
	ATQAttributeOptions,
	ATQAttributeOptionsInput,
	AddToQuote,
	Attributes,
	AttributesOptions,
	Category,
	Options,
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
					attributes: ["id", "stock_id"],
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
			],
			attributes: ["id", "product_id", "customer_id", "qty"],
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
				const assignAttributesOptions: Array<ATQAttributeOptionsInput> = quoteData.attributeOptions.map((option_id) => {
					return {
						add_to_quote_id: data.id,
						attribute_id: option_id.attribute_id,
						option_id: option_id.option_id,
					} as ATQAttributeOptionsInput;
				});
				await ATQAttributeOptions.bulkCreate(assignAttributesOptions, { transaction });
				return "Product Added";
			});
		});
	};

	public edit = async (quoteId: string, quoteData: CreateAddToQuoteDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			await ATQAttributeOptions.destroy({ where: { add_to_quote_id: quoteId }, transaction });
			return await AddToQuote.update(quoteData, { where: { id: quoteId }, transaction }).then(async () => {
				const assignAttributesOptions: Array<ATQAttributeOptionsInput> = quoteData.attributeOptions.map((option_id) => {
					return {
						add_to_quote_id: quoteId,
						attribute_id: option_id.attribute_id,
						option_id: option_id.option_id,
					} as ATQAttributeOptionsInput;
				});
				await ATQAttributeOptions.bulkCreate(assignAttributesOptions, { transaction });
				return "Product Added";
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
