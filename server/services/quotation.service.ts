import { executeTransaction, sequelizeConnection } from "../config/database";
import { QuotationAttributeOptions, QuotationAttributeOptionsInput, QuotationMaster, QuotationProduct, QuotationProductInput } from "../models";
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
			include: [{ model: QuotationProduct, include: [{ model: QuotationAttributeOptions }] }],
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

	public create = async (categoryData: QuotationDTO) => {
		return await executeTransaction(async (transaction: Transaction) => {
			return await QuotationMaster.create(categoryData, { transaction }).then(async (quotation) => {
				const quotationProducts: Array<QuotationProductsDTO> = categoryData.quotationProducts.map((quoPro) => {
					return {
						product_id: quoPro.product_id,
						qty: quoPro.qty,
						quotation_id: quotation.id,
						attributeOptions: quoPro.attributeOptions,
					} as QuotationProductsDTO;
				});
				for await (const quoProduct of quotationProducts) {
					return await QuotationProduct.create(quoProduct, { transaction }).then(async (products) => {
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
				return "Quotation created successfully";
			});
		});
	};

	// public edit = async (categoryId: string, categoryData: CategoryDTO) => {
	// 	return await Category.update(categoryData, { where: { id: categoryId } }).then(() => {
	// 		return "Category updated successfully";
	// 	});
	// };

	public changeStatus = async (quotation_id: string, status: QUOTATION_STATUS) => {
		return await QuotationMaster.update({ status }, { where: { id: quotation_id } });
	};

	public delete = async (quotation_id: string) => {
		return await QuotationMaster.destroy({ where: { id: quotation_id } });
	};
}
