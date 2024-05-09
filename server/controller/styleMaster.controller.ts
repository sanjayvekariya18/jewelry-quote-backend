import { NextFunction, Request, Response } from "express";
import { StyleMasterService } from "../services";
import { StyleMasterValidation } from "../validations";
import { SearchStyleMasterDTO } from "../dto";

export default class StyleMasterController {
	private service = new StyleMasterService();
	private validation = new StyleMasterValidation();

	public getAll = {
		validation: this.validation.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchStyleMasterDTO(req.query));
			return res.api.create(data);
		},
	};

	public getMenu = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getMenu();
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const style_master_id: string = req.params["id"] as string;

			const data = await this.service.findOne({ id: style_master_id });
			return res.api.create(data);
		},
	};

	public getStyleAsPerSubCategoryId = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const sub_category_id: string = req.params["id"] as string;
			const data = await this.service.getStyleAsPerSubCategoryId(sub_category_id);
			return res.api.create(data);
		},
	};
}
