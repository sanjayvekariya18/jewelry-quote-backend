import { NextFunction, Request, Response } from "express";
import { SubcategoryService } from "../services";
import { SubCategoriesValidation } from "../validations";
import { SearchSubCategoryDTO, CreateSubCategoryDTO, EditSubCategoryDTO } from "../dto";
import { DuplicateRecord, NotExistHandler } from "../errorHandler";
import { Op } from "sequelize";
import { removeFile, saveFile } from "../utils/helper";
import { Category, SubCategory } from "../models";

export default class SubCategoryController {
	private subCategoryService = new SubcategoryService();
	private subCategoryValidations = new SubCategoriesValidation();

	public getAll = {
		validation: this.subCategoryValidations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.subCategoryService.getAll(new SearchSubCategoryDTO(req.query));
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

			const data = await this.subCategoryService.getSubCategoryByCategory(categoryData.id);
			res.api.create(data);
		},
	};

	public create = {
		validation: this.subCategoryValidations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const subcategoryData = new CreateSubCategoryDTO(req.body);
			const subcategoryExist = await this.subCategoryService.findOne({ name: subcategoryData.name, is_deleted: false });

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
			const data = await this.subCategoryService.create(subcategoryData);
			res.api.create(data);
		},
	};

	public edit = {
		validation: this.subCategoryValidations.edit,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const subcategoryId: string = req.params["id"] as string;
			const subCategoryExist = await SubCategory.findByPk(subcategoryId);
			if (!subCategoryExist) {
				throw new NotExistHandler("Sub Category Not Found");
			}
			const subcategoryData = new EditSubCategoryDTO(req.body);
			const subcategoryExist = await this.subCategoryService.findOne({
				id: { [Op.not]: subcategoryId },
				name: subcategoryData.name,
				is_deleted: false,
			});

			if (subcategoryExist && subcategoryExist != null) {
				throw new DuplicateRecord("Subcategory already exists");
			}
			const file: any = req.files;
			if (file) {
				const oldImgData = await this.subCategoryService.findOne({ id: subcategoryId });
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
			const data = await this.subCategoryService.edit(subcategoryId, subcategoryData);
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
			await this.subCategoryService
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
