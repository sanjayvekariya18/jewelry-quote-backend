import { NextFunction, Request, Response } from "express";
import { ProductService, SubcategoryService } from "../services";
import { ProductValidation } from "../validations";
import { SearchProductDTO, ProductDTO } from "../dto";
import { NotExistHandler } from "../errorHandler";
import { Products, SubCategoryAttributes } from "../models";

export default class ProductController {
	private service = new ProductService();
	private subcategoryService = new SubcategoryService();
	private validations = new ProductValidation();

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchProductDTO(req.query));
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const product_id: string = req.params["id"] as string;
			const productExist = await this.service.findOne({ id: product_id, is_deleted: false });
			if (!productExist) {
				throw new NotExistHandler("Product Not Found");
			}
			return res.api.create(productExist);
		},
	};

	public create = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const productData = new ProductDTO(req.body);

			const subcategoryExist = await this.subcategoryService.simpleFindOne({ id: productData.sub_category_id, is_deleted: false });
			if (subcategoryExist == null) {
				throw new NotExistHandler("Subcategory not found");
			}

			let ids = await SubCategoryAttributes.findAll({
				where: { sub_category_id: productData.sub_category_id },
				attributes: ["attribute_id"],
				raw: true,
			}).then((subCatAtt) => subCatAtt.map((row) => row.attribute_id));

			productData.attributeOptions = productData.attributeOptions.filter((attOps) => ids.includes(attOps.attribute_id));
			const data = await this.service.create(productData);
			return res.api.create(data);
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
			const productData = new ProductDTO(req.body);

			const subcategoryExist = await this.subcategoryService.simpleFindOne({ id: productData.sub_category_id, is_deleted: false });
			if (subcategoryExist && subcategoryExist != null) {
				throw new NotExistHandler("Subcategory not found");
			}

			let ids = await SubCategoryAttributes.findAll({
				where: { sub_category_id: productData.sub_category_id },
				attributes: ["attribute_id"],
				raw: true,
			}).then((subCatAtt) => subCatAtt.map((row) => row.attribute_id));

			productData.attributeOptions = productData.attributeOptions.filter((attOps) => ids.includes(attOps.attribute_id));

			const data = await this.service.edit(productId, productData);
			return res.api.create(data);
		},
	};

	public toggleProductActive = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const product_id: string = req.params["id"] as string;
			const userExist = await Products.findByPk(product_id);
			if (!userExist) {
				throw new NotExistHandler("Product Not Found");
			}
			await this.service
				.toggleProductActive(product_id, req.authUser.id)
				.then((flag) => {
					return res.api.create({
						message: `User is ${flag?.is_active ? "Actived" : "Deactivated"}`,
					});
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
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
					return res.api.create({
						message: `Product deleted`,
					});
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
		},
	};
}
