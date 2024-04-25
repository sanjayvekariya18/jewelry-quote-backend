import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../services";
import { CategoryValidations } from "../validations";
import { CategoryDTO, SearchCategoryDTO } from "../dto";
import { DuplicateRecord, NotExistHandler } from "../errorHandler";
import { Op } from "sequelize";
import { removeFile, saveFile } from "../utils/helper";
import { Category } from "../models";

export default class CategoryController {
	private service = new CategoryService();
	private validations = new CategoryValidations();

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchCategoryDTO(req.query));
			res.api.create(data);
		},
	};

	public getCategoryDetails = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const categoryId: string = req.params["id"] as string;
			const categoryExist = await Category.findByPk(categoryId, { attributes: ["id", "name", "details", "img_url", "logo_url"] });
			if (!categoryExist) {
				throw new NotExistHandler("Category Not Found");
			}
			const data = await this.service.getCategoryDetails(categoryId);
			res.api.create(data);
		},
	};

	public create = {
		validation: this.validations.category,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const categoryData = new CategoryDTO(req.body);
			const categoryExist = await this.service.findOne({ name: categoryData.name, is_deleted: false });

			if (categoryExist && categoryExist != null) {
				throw new DuplicateRecord("Category already exists");
			}
			const file: any = req.files;
			if (file) {
				if (file.img_url) {
					let uploadedImg: any = await saveFile(file.img_url, "category");
					categoryData.img_url = uploadedImg.upload_path;
				}
				if (file.logo_url) {
					let uploadedImg: any = await saveFile(file.logo_url, "category");
					categoryData.logo_url = uploadedImg.upload_path;
				}
			}
			const data = await this.service.create(categoryData);
			res.api.create(data);
		},
	};

	public edit = {
		validation: this.validations.category,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const categoryId: string = req.params["id"] as string;
			const categoryExist = await Category.findByPk(categoryId);
			if (!categoryExist) {
				throw new NotExistHandler("Category Not Found");
			}
			const categoryData = new CategoryDTO(req.body);
			const categoryDuplicateExist = await this.service.findOne({
				id: { [Op.not]: categoryId },
				name: categoryData.name,
				is_deleted: false,
			});

			if (categoryDuplicateExist && categoryDuplicateExist != null) {
				throw new DuplicateRecord("Category already exists");
			}

			const file: any = req.files;
			if (file) {
				const oldImgData = await this.service.findOne({ id: categoryId });
				if (file.img_url) {
					oldImgData?.img_url && (await removeFile(oldImgData.img_url));
					let uploadedImg: any = await saveFile(file.img_url, "category");
					categoryData.img_url = uploadedImg.upload_path;
				}
				if (file.logo_url) {
					oldImgData?.logo_url && (await removeFile(oldImgData.logo_url));
					let uploadedImg: any = await saveFile(file.logo_url, "category");
					categoryData.logo_url = uploadedImg.upload_path;
				}
			}
			const data = await this.service.edit(categoryId, categoryData);
			res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const category_id: string = req.params["id"] as string;
			const categoryExist = await this.service.findOne({ id: category_id });
			if (!categoryExist) {
				throw new NotExistHandler("Category Not Found");
			}
			await this.service
				.delete(category_id, req.authUser.id)
				.then(async () => {
					if (categoryExist.img_url) await removeFile(categoryExist.img_url);
					if (categoryExist.logo_url) await removeFile(categoryExist.logo_url);
					return res.api.create({
						message: `Category deleted`,
					});
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
		},
	};
}
