import { NextFunction, Request, Response } from "express";
import { AddToQuoteService, CustomerDetailsService } from "../services";
import { AddToQuoteValidations } from "../validations";
import { CreateAddToQuoteDTO, EditAddToQuoteDTO } from "../dto";
import { FormErrorsHandler, UnauthorizedUserHandler } from "../errorHandler";
import { OtherDetailMaster, ProductAttributeOptions, ProductOtherDetail, Products } from "../models";
import { sequelizeConnection } from "../config/database";
import { OTHER_DETAIL_TYPES } from "../enum";

export default class AddToQuoteController {
	private service = new AddToQuoteService();
	private customerMasterService = new CustomerDetailsService();
	private validation = new AddToQuoteValidations();
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let data = await this.service.getAll(req.customer.id);
			res.api.create(data);
		},
	};

	public getATQTotalCount = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getATQTotalCount(req.customer.id);
			res.api.create({
				totalQuote: data,
			});
		},
	};

	public create = {
		validation: this.validation.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const ATQData = new CreateAddToQuoteDTO(req.body);

			const productExist = await Products.findOne({
				where: { id: ATQData.product_id, is_deleted: false },
			});
			if (!productExist || productExist == null) {
				return res.api.validationErrors({ message: "Product not found" });
			}

			let ids = await ProductAttributeOptions.findAll({
				where: { product_id: productExist.id },
				attributes: ["attribute_id"],
				raw: true,
			}).then((subCatAtt) => subCatAtt.map((row) => row.attribute_id));

			let checkAttributes = ATQData.attributeOptions.filter((attOps) => ids.includes(attOps.attribute_id));
			if (ids.length != checkAttributes.length) {
				return res.api.validationErrors({ message: "Please enter all attributes and options. Attributes should be included in same subCategory" });
			}

			const getProductOtherDetails: any = await ProductOtherDetail.findAll({
				where: { product_id: ATQData.product_id },
				attributes: [
					"id",
					"product_id",
					"other_detail_id",
					"detail_value",
					[this.Sequelize.col("OtherDetailMaster.detail_name"), "detail_name"],
					[this.Sequelize.col("OtherDetailMaster.detail_type"), "detail_type"],
				],
				include: [{ model: OtherDetailMaster, attributes: [] }],
			}).then((data) => data.map((row) => row.get({ plain: true })));

			if (getProductOtherDetails.length != ATQData.otherDetails.length) {
				return res.api.validationErrors({ message: "All Product Other Detail are required" });
			}
			const checkExists = ATQData.otherDetails.every((othDet) =>
				getProductOtherDetails.findIndex((row: any) => row.detail_name == othDet.detail_name) != -1 ? true : false
			);
			if (!checkExists) return res.api.validationErrors({ message: "One or more Product Other Detail not available" });

			// const checkOtherDetailValue = ATQData.otherDetails.every((othDet) =>
			// 	getProductOtherDetails.findIndex((row: any) => {
			// 		console.log("row.detail_name", row.detail_name);
			// 		console.log("othDet.detail_name", othDet.detail_name);
			// 		console.log("row.detail_type", row.detail_type);
			// 		console.log("row.detail_value", row.detail_value);
			// 		console.log("othDet.detail_value", othDet.detail_value);
			// 		return row.detail_name == othDet.detail_name && row.detail_type == OTHER_DETAIL_TYPES.LABEL && row.detail_value != othDet.detail_value;
			// 	}) != -1
			// 		? true
			// 		: false
			// );

			// const recordExist = await   this.service.findOne({ customer_id: req.customer.id, product_id: ATQData.product_id });
			// if (recordExist || recordExist != null) {
			// 	return res.api.duplicateRecord({
			// 		message: `Item already exist to quote`,
			// 	});
			// }

			const data = await this.service.create(ATQData);
			res.api.create(data);
		},
	};

	public edit = {
		validation: this.validation.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const ATQId = req.params["id"];
			const isValidReq = await this.service.findOne({ id: ATQId, customer_id: req.customer.id });

			if (isValidReq && isValidReq != null) {
				const errors: any = {};
				if (Number.isNaN(req.body["qty"])) {
					errors["qty"] = ["Quantity must be numeric"];
				} else if (Number(req.body["qty"]) < 1) {
					errors["qty"] = ["Quantity must be greater than 0 (zero)"];
				}

				if (Object.keys(errors).length > 0) {
					throw new FormErrorsHandler(errors);
				}

				const ATQData = new EditAddToQuoteDTO(req.body);
				const data = await this.service.edit(ATQId, ATQData);
				return res.api.create(data);
			} else {
				throw new UnauthorizedUserHandler("Unauthorized request");
			}
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const ATQId = req.params["id"];
			const isValidReq = await this.service.findOne({
				id: ATQId,
				customer_id: req.customer.id,
			});

			if (isValidReq && isValidReq != null) {
				await this.service.delete(ATQId).then(() => {
					return res.api.create({
						message: `Removed from quote`,
					});
				});
			} else {
				throw new UnauthorizedUserHandler("Unauthorized request");
			}
		},
	};
}
