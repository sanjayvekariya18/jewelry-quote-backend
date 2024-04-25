import { Request, Response } from "express";
import { ListService } from "../services";

export default class ListController {
	private service = new ListService();

	public category = {
		controller: async (req: Request, res: Response): Promise<void> => {
			const data = await this.service.category();
			return res.api.create(data);
		},
	};
	public subCategory = {
		controller: async (req: Request, res: Response): Promise<void> => {
			const data = await this.service.subCategory();
			return res.api.create(data);
		},
	};
	public users = {
		controller: async (req: Request, res: Response): Promise<void> => {
			const data = await this.service.users();
			return res.api.create(data);
		},
	};
	public customers = {
		controller: async (req: Request, res: Response): Promise<void> => {
			const data = await this.service.customers();
			return res.api.create(data);
		},
	};

	public attributes = {
		controller: async (req: Request, res: Response): Promise<void> => {
			const data = await this.service.attributes();
			return res.api.create(data);
		},
	};

	public options = {
		controller: async (req: Request, res: Response): Promise<void> => {
			const data = await this.service.options();
			return res.api.create(data);
		},
	};
}
