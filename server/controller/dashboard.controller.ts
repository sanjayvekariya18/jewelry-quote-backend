import { Request, Response } from "express";
import { DashboardService } from "../services";

export default class DashboardController {
	private service = new DashboardService();

	public getTotalData = {
		controller: async (req: Request, res: Response): Promise<void> => {
			const data = await this.service.getTotalData();
			return res.api.create(data);
		},
	};
}
