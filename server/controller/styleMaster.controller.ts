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

	public getStyleAsPerSubCategoryId = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const sub_category_id: string = req.params["id"] as string;
			const data = await this.service.getStyleAsPerSubCategoryId(sub_category_id);
			return res.api.create(data);
		},
	};

	// public create = {
	// 	validation: this.validation.createDynamicMenu,
	// 	controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// 		const dynamicMenuData = new CreateDynamicMenuDTO(req.body);

	// 		if (dynamicMenuData.parent_id && req.body.parent_id != 0) {
	// 			const checkParentId = await this.service.findOne({ menu_id: dynamicMenuData.parent_id });
	// 			if (!checkParentId) {
	// 				throw new NotExistHandler("Parent Menu not found");
	// 			}
	// 			if (dynamicMenuData.title) {
	// 				const checkTitle = await this.service.findOne({ title: dynamicMenuData.title, parent_id: dynamicMenuData.parent_id });
	// 				if (!isEmpty(checkTitle)) {
	// 					throw new DuplicateRecord("title already exists");
	// 				}
	// 			}
	// 			if (dynamicMenuData.total_positions) {
	// 				throw new NotExistHandler("not Enter Total Positions");
	// 			}
	// 		}
	// 		if (isEmpty(dynamicMenuData.parent_id) && !isEmpty(dynamicMenuData.total_positions)) {
	// 			return res.api.validationErrors({
	// 				total_positions: ["The total_positions field is required."],
	// 			});
	// 		}
	// 		const data = await this.service.create(dynamicMenuData, req.authUser.user_id);
	// 		return res.api.create(data);
	// 	},
	// };

	// public edit = {
	// 	validation: this.validation.editDynamicMenu,
	// 	controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// 		const dynamicMenuId: string = req.params["id"] as string;
	// 		const dynamicMenuData = new EditDynamicMenuDTO(req.body);

	// 		if (dynamicMenuData.parent_id && req.body.parent_id != 0) {
	// 			// dynamicMenuData.total_positions = null;

	// 			const checkParentId = await this.service.findOne({ menu_id: dynamicMenuData.parent_id });
	// 			if (!checkParentId) {
	// 				throw new NotExistHandler("Parent Menu not found");
	// 			}
	// 			if (dynamicMenuData.title) {
	// 				const checkTitle = await this.service.findOne({
	// 					menu_id: { [Op.not]: dynamicMenuId },
	// 					title: dynamicMenuData.title,
	// 					parent_id: dynamicMenuData.parent_id,
	// 				});
	// 				if (!isEmpty(checkTitle)) {
	// 					throw new DuplicateRecord("title already exists");
	// 				}
	// 			}
	// 			// 	if (dynamicMenuData.total_positions) {
	// 			// 		throw new NotExistHandler("Do not Enter Total Positions");
	// 			// 	}
	// 			// }
	// 			// if (isEmpty(dynamicMenuData.parent_id) && !isEmpty(dynamicMenuData.total_positions)) {
	// 			// 	return res.api.validationErrors({
	// 			// 		total_positions: ["The total_positions field is required."],
	// 			// 	});
	// 		}
	// 		const data = await this.service.edit(dynamicMenuId, dynamicMenuData, req.authUser.user_id);
	// 		return res.api.create(data);
	// 	},
	// };

	// public editMultipleMenus = {
	// 	validation: this.validation.editMultipleMenus,
	// 	controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// 		const payloadMenus: any = req.body.menus;

	// 		for await (const menus of payloadMenus) {
	// 			if (menus.parent_id) {
	// 				menus.total_positions = null;

	// 				const checkParentId = await this.service.findOne({ menu_id: menus.parent_id });
	// 				if (!checkParentId) {
	// 					throw new NotExistHandler("Parent Menu not found");
	// 				}
	// 				if (menus.total_positions) {
	// 					throw new NotExistHandler("Do not Enter Total Positions");
	// 				}
	// 			}
	// 			if (menus.parent_id == null && menus.total_positions >= 0) {
	// 				return res.api.validationErrors({
	// 					total_positions: ["The total_positions field is required."],
	// 				});
	// 			}

	// 			let { menu_id, ...restPayload } = menus;
	// 			const filter = { where: { menu_id: menu_id } };
	// 			await this.service.updateHeader(restPayload, filter);
	// 		}
	// 		return res.api.create({
	// 			message: "Menu updated successfully!",
	// 		});
	// 	},
	// };

	// public delete = {
	// 	controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	// 		const dynamicMenuId: string = req.params["id"] as string;
	// 		await this.service.delete(dynamicMenuId, req.authUser.user_id).then(async () => {
	// 			return res.api.create({
	// 				message: `Menu deleted`,
	// 			});
	// 		});
	// 	},
	// };
}
