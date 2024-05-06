import { NextFunction, Request, Response } from "express";
import { AddToQuoteService, QuotationService } from "../services";
import { QuotationValidations } from "../validations";
import { QuotationDTO, SearchQuotationDTO } from "../dto";
import { NotExistHandler } from "../errorHandler";
import { QUOTATION_STATUS } from "../enum";

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

	public placeQuotation = {
		validation: { notes: "string" },
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const customer_id: string = req.customer["id"] as string;
			const addToQuoteData: any = await this.addToQuoteService.getAll(customer_id);

			let productData = [];
			for (const quote of addToQuoteData) {
				productData.push({
					product_id: quote.product_id,
					qty: quote.qty,
					attributeOptions: quote.ATQAttributeOptions.map((attOpt: any) => {
						return { attribute_name: attOpt.Attribute.name, option_name: attOpt.Option.name };
					}),
					styleMaster: quote.styleMaster,
				});
			}

			let quotationObject = new QuotationDTO({
				customer_id,
				notes: req.body.notes,
				quotationProducts: productData,
			});

			const data = await this.service.placeQuotation(quotationObject);
			return res.api.create(data);
		},
	};

	public changeStatus = {
		validation: this.validations.changeStatus,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const quotation_id: string = req.params["id"] as string;
			const status: QUOTATION_STATUS = req.body.status as QUOTATION_STATUS;
			const quotationExist = await this.service.findOne({ id: quotation_id });
			if (!quotationExist) {
				throw new NotExistHandler("Quotation Not Found");
			}
			await this.service.changeStatus(quotation_id, status);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const quotation_id: string = req.params["id"] as string;
			const quotationExist = await this.service.findOne({ id: quotation_id });
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
