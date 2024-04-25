import { NextFunction, Request, Response } from "express";
import { ProductService, SubcategoryService } from "../services";
import { ProductValidation } from "../validations";
import { SearchProductDTO, CreateProductDTO, EditProductDTO } from "../dto";
import { NotExistHandler } from "../errorHandler";
import { Products } from "../models";

export default class ProductController {
	private service = new ProductService();
	private subcategoryService = new SubcategoryService();
	private validations = new ProductValidation();

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchProductDTO(req.query));
			res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const product_id: string = req.params["id"] as string;
			const productExist = await Products.findByPk(product_id);
			if (!productExist) {
				throw new NotExistHandler("Product Not Found");
			}
			res.api.create(productExist);
		},
	};

	public create = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const productData = new CreateProductDTO(req.body);

			const subcategoryExist = await this.subcategoryService.findOne({ id: productData.sub_category_id, is_deleted: false });
			if (subcategoryExist && subcategoryExist != null) {
				throw new NotExistHandler("Subcategory not found");
			}

			const data = await this.service.create(productData);
			res.api.create(data);
		},
	};

	public edit = {
		validation: this.validations.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const productId: string = req.params["id"] as string;
			const productExist = await Products.findByPk(productId);
			if (!productExist) {
				throw new NotExistHandler("Product Not Found");
			}
			const productData = new EditProductDTO(req.body);

			const subcategoryExist = await this.subcategoryService.findOne({ id: productData.sub_category_id, is_deleted: false });
			if (subcategoryExist && subcategoryExist != null) {
				throw new NotExistHandler("Subcategory not found");
			}

			const data = await this.service.edit(productId, productData);
			res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const productId: string = req.params["id"] as string;
			const productExist = await Products.findByPk(productId);
			if (!productExist) {
				throw new NotExistHandler("Product Not Found");
			}
			await this.service
				.delete(productId, req.authUser.id)
				.then(async () => {
					res.api.create({
						message: `Product deleted`,
					});
				})
				.catch((error) => {
					res.api.serverError(error);
				});
		},
	};
}
