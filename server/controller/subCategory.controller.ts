import { NextFunction, Request, Response } from "express";
import { SubcategoryService } from "../services";
import { SubCategoriesValidation } from "../validations";
import { SearchSubCategoryDTO, CreateSubCategoryDTO, EditSubCategoryDTO } from "../dto";
import { DuplicateRecord, NotExistHandler } from "../errorHandler";
import { Op } from "sequelize";
import { removeFile, saveFile } from "../utils/helper";
import { Category, SubCategory } from "../models";

export default class SubCategoryController {
	private service = new SubcategoryService();
	private validations = new SubCategoriesValidation();

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchSubCategoryDTO(req.query));
			res.api.create(data);
		},
	};

	public getSubCategoryByCategory = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const categoryName: string = req.params["name"] as string;
			const categoryData = await Category.findOne({ where: { name: categoryName }, raw: true, attributes: ["id"] });
			if (!categoryData && categoryData == null) {
				throw new DuplicateRecord("Category not found");
			}

			const data = await this.service.getSubCategoryByCategory(categoryData.id);
			res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const categoryId: string = req.params["id"] as string;
			const categoryExist = await Category.findByPk(categoryId, { attributes: ["id", "name", "details", "img_url", "logo_url"] });
			if (!categoryExist) {
				throw new NotExistHandler("Sub category Not Found");
			}
			const data = await this.service.findOne({ category_id: categoryId });
			res.api.create(data);
		},
	};

	public create = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const subcategoryData = new CreateSubCategoryDTO(req.body);
			const subcategoryExist = await this.service.findOne({ name: subcategoryData.name, is_deleted: false });

			if (subcategoryExist && subcategoryExist != null) {
				throw new DuplicateRecord("Subcategory already exists");
			}
			const file: any = req.files;
			if (file) {
				if (file.img_url) {
					let profile: any = await saveFile(file.img_url, "subcategory");
					subcategoryData.img_url = profile.upload_path;
				}
				if (file.logo_url) {
					let profile: any = await saveFile(file.logo_url, "subcategory");
					subcategoryData.logo_url = profile.upload_path;
				}
			}
			const data = await this.service.create(subcategoryData);
			res.api.create(data);
		},
	};

	public edit = {
		validation: this.validations.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const subcategoryId: string = req.params["id"] as string;
			const subCategoryExist = await SubCategory.findByPk(subcategoryId);
			if (!subCategoryExist) {
				throw new NotExistHandler("Sub Category Not Found");
			}
			const subcategoryData = new EditSubCategoryDTO(req.body);
			const subcategoryExist = await this.service.findOne({
				id: { [Op.not]: subcategoryId },
				name: subcategoryData.name,
				is_deleted: false,
			});

			if (subcategoryExist && subcategoryExist != null) {
				throw new DuplicateRecord("Subcategory already exists");
			}
			const file: any = req.files;
			if (file) {
				const oldImgData = await this.service.findOne({ id: subcategoryId });
				if (file.img_url) {
					// Remove old image
					oldImgData?.img_url && (await removeFile(oldImgData.img_url));
					// Upload new image
					let profile: any = await saveFile(file.img_url, "subcategory");
					subcategoryData.img_url = profile.upload_path;
				}
				if (file.logo_url) {
					// Remove old image
					oldImgData?.logo_url && (await removeFile(oldImgData.logo_url));
					// Upload new image
					let profile: any = await saveFile(file.logo_url, "subcategory");
					subcategoryData.logo_url = profile.upload_path;
				}
			}
			const data = await this.service.edit(subcategoryId, subcategoryData);
			res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const subcategoryId: string = req.params["id"] as string;
			const subCategoryExist = await SubCategory.findByPk(subcategoryId);
			if (!subCategoryExist) {
				throw new NotExistHandler("Sub Category Not Found");
			}
			await this.service
				.delete(subcategoryId, req.authUser.id)
				.then(async (data) => {
					if (data.img_url) {
						await removeFile(data.img_url);
					}
					if (data.logo_url) {
						await removeFile(data.logo_url);
					}
					res.api.create({
						message: `Subcategory deleted`,
					});
				})
				.catch((error) => {
					res.api.serverError(error);
				});
		},
	};
}
