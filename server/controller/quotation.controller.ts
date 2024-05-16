import { NextFunction, Request, Response } from "express";
import { AddToQuoteService, QuotationService } from "../services";
import { QuotationValidations } from "../validations";
import { QuotationDTO, SearchQuotationDTO } from "../dto";
import { NotExistHandler } from "../errorHandler";
import { QUOTATION_STATUS } from "../enum";
import { QuotationProduct } from "../models";

export default class QuotationController {
	private service = new QuotationService();
	private validations = new QuotationValidations();
	private addToQuoteService = new AddToQuoteService();

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchQuotationDTO(req.query));
			return res.api.create(data);
		},
	};

	public getAllForCustomer = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customer_id: string = req.customer["id"] as string;
			const searchQuery = new SearchQuotationDTO(req.query);
			searchQuery.customer_id = customer_id;
			const data = await this.service.getAll(searchQuery);
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const quotatuon_id: string = req.params["id"] as string;
			const quotationExist = await this.service.findOne({ id: quotatuon_id });
			if (!quotationExist) {
				throw new NotExistHandler("Quotation Not Found");
			}
			return res.api.create(quotationExist);
		},
	};

	public findOneForCustomer = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const quotatuon_id: string = req.params["id"] as string;
			const quotationExist = await this.service.findOne({ id: quotatuon_id, customer_id: req.customer.id });
			if (!quotationExist) {
				throw new NotExistHandler("Quotation Not Found");
			}
			return res.api.create(quotationExist);
		},
	};

	public placeQuotation = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customer_id: string = req.customer["id"] as string;
			const addToQuoteData: any = await this.addToQuoteService.getAll(customer_id);

			let productData = [];
			for (const quote of addToQuoteData) {
				productData.push({
					product_id: quote.product_id,
					qty: quote.qty,
					notes: quote.notes,

					attributeOptions: quote.ATQAttributeOptions.map((attOpt: any) => {
						return { attribute_name: attOpt.Attribute.name, option_name: attOpt.Option.name };
					}),
					otherDetails: quote.ATQOtherDetails.map((othDet: any) => {
						return { detail_name: othDet.detail_name, detail_value: othDet.detail_value };
					}),
				});
			}

			let quotationObject = new QuotationDTO({
				customer_id,
				quotationProducts: productData,
			});

			const data = await this.service.placeQuotation(quotationObject);
			return res.api.create(data);
		},
	};

	public changeProductPrice = {
		validation: {
			price: "required|numeric",
		},
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const quotation_product_id: string = req.params["id"] as string;
			const price: number = req.body["price"] as number;

			const quotationExist = await QuotationProduct.findOne({ where: { id: quotation_product_id } });
			if (!quotationExist) {
				throw new NotExistHandler("Quotation Product Not Found");
			}

			const data = await this.service.changeProductPrice(quotation_product_id, price);
			return res.api.create(data);
		},
	};

	public changeStatus = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const quotation_id: string = req.params["id"] as string;
			const quotationExist = await this.service.simpleFindOne({ id: quotation_id, status: QUOTATION_STATUS.PENDING });
			if (!quotationExist) {
				throw new NotExistHandler("Quotation Not Found with pending status");
			}
			const data = await this.service.changeStatus(quotation_id, QUOTATION_STATUS.COMPLETED);
			return res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const quotation_id: string = req.params["id"] as string;
			const quotationExist = await this.service.simpleFindOne({ id: quotation_id });
			if (!quotationExist) {
				throw new NotExistHandler("Quotation Not Found");
			}
			await this.service
				.delete(quotation_id)
				.then(() => {
					return res.api.create({ message: `Quotation deleted` });
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
		},
	};
}
