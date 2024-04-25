import { NextFunction, Request, Response } from "express";
import { WishListServices } from "../services";
import { Products } from "../models";
import { NotExistHandler } from "../errorHandler";
import { BulkCreateWishlistDTO } from "../dto";

export default class WishListController {
	private services = new WishListServices();
	public getAll = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.services.getAll(req.customer.id);
			return res.api.create({ count: data.length, rows: data });
		},
	};

	public bulkCreate = {
		// validation: this.addToCartValidation.bulkCreate,
		controller: async (req: Request, res: Response, next: NextFunction) => {
			const wishlistData = new BulkCreateWishlistDTO(req.body);
			const data: any = await this.services.bulkCreate(wishlistData);
			return res.api.create(data);
		},
	};

	public toggle = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const product_id: string = req.params["id"] as string;
			const productExist = await Products.findByPk(product_id);
			if (!productExist) {
				throw new NotExistHandler("Product Not Found");
			}
			await this.services.toggle(req.customer.id, product_id).then(() => {
				res.api.create({
					message: `WishList Updated`,
				});
			});
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const product_id: string = req.params["id"] as string;
			await this.services.delete(product_id).then(() => {
				res.api.create({
					message: `WishList Removed`,
				});
			});
		},
	};
}
