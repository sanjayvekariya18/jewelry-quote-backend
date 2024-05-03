import { NextFunction, Request, Response } from "express";
import { AddToQuoteService, CustomerDetailsService } from "../services";
import { AddToQuoteValidations } from "../validations";
import { CreateAddToQuoteDTO, EditAddToQuoteDTO } from "../dto";
import { FormErrorsHandler, UnauthorizedUserHandler } from "../errorHandler";
import { ProductAttributeOptions, Products, StyleMaster } from "../models";

export default class AddToQuoteController {
	private service = new AddToQuoteService();
	private customerMasterService = new CustomerDetailsService();
	private validation = new AddToQuoteValidations();

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

			const checkStyle = await StyleMaster.findAll({ where: { sub_category_id: productExist.sub_category_id }, raw: true }).then((data) =>
				data.map((row) => row.name)
			);

			const isExists = ATQData.styleMaster.every((data) => checkStyle.includes(data));
			if (isExists == false) {
				return res.api.validationErrors({ message: "One or more style master not available" });
			}

			const recordExist = await this.service.findOne({ customer_id: req.customer.id, product_id: ATQData.product_id });
			if (recordExist || recordExist != null) {
				return res.api.duplicateRecord({
					message: `Item already exist to quote`,
				});
			}

			const data = await this.service.create(ATQData);
			res.api.create(data);
		},
	};

	public edit = {
		validation: this.validation.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const errors: any = {};
			if (Number.isNaN(req.body["qty"])) {
				errors["qty"] = ["Quantity must be numeric"];
			} else if (Number(req.body["qty"]) < 1) {
				errors["qty"] = ["Quantity must be greater than 0 (zero)"];
			}

			if (Object.keys(errors).length > 0) {
				throw new FormErrorsHandler(errors);
			}

			const ATQId = req.params["id"];
			const ATQData = new EditAddToQuoteDTO(req.body);

			const isValidReq = await this.service.findOne({
				id: ATQId,
				customer_id: req.customer.id,
			});

			if (isValidReq && isValidReq != null) {
				// let ids = await ProductAttributeOptions.findAll({
				// 	where: { product_id: isValidReq.id },
				// 	attributes: ["attribute_id"],
				// 	raw: true,
				// }).then((subCatAtt) => subCatAtt.map((row) => row.attribute_id));

				// let checkAttributes = ATQData.attributeOptions.filter((attOps) => ids.includes(attOps.attribute_id));
				// if (ids.length != checkAttributes.length) {
				// 	return res.api.validationErrors({ message: "Please enter all attributes and options. Attributes should be included in same subCategory" });
				// }

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
