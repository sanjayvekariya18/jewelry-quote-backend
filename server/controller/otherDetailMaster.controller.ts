import { NextFunction, Request, Response } from "express";
import { OtherDetailMasterService } from "../services";
import { CatalogValidations } from "../validations";
import { NotExistHandler } from "../errorHandler";

export default class OtherDetailMasterController {
	private service = new OtherDetailMasterService();

	public getAll = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll();
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const otherDetail_id: string = req.params["id"] as string;
			const otherDetailExists = await this.service.findOne({ id: otherDetail_id });
			if (!otherDetailExists) {
				throw new NotExistHandler("Other Detail Master Not Found");
			}
			return res.api.create(otherDetailExists);
		},
	};
}
