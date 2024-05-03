import { NextFunction, Request, Response } from "express";
import { CategoryService, SubcategoryService } from "../services";
import { SubCategoriesValidation } from "../validations";
import { SearchSubCategoryDTO, CreateSubCategoryDTO, EditSubCategoryDTO } from "../dto";
import { DuplicateRecord, NotExistHandler } from "../errorHandler";
import { Op } from "sequelize";
import { removeFile, saveFile } from "../utils/helper";
import { Attributes, Category, SubCategory } from "../models";

export default class SubCategoryController {
	private service = new SubcategoryService();
	private categoryService = new CategoryService();
	private validations = new SubCategoriesValidation();

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchSubCategoryDTO(req.query));
			return res.api.create(data);
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
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const subCategoryId: string = req.params["id"] as string;
			const subCategoryExist = await SubCategory.findByPk(subCategoryId);
			if (!subCategoryExist) {
				throw new NotExistHandler("Sub category Not Found");
			}
			const data = await this.service.findOne({ id: subCategoryId, is_deleted: false });
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const subcategoryData = new CreateSubCategoryDTO(req.body);
			const subcategoryExist = await this.service.simpleFindOne({ name: subcategoryData.name, is_deleted: false });
			if (subcategoryExist && subcategoryExist != null) {
				throw new DuplicateRecord("Subcategory already exists");
			}

			const checkCategory = await this.categoryService.findOne({ id: subcategoryData.category_id });
			if (checkCategory == null) {
				throw new DuplicateRecord("Category not found");
			}

			const findAllAttributes = await Attributes.findAll({ where: { is_deleted: false }, raw: true, attributes: ["id"] }).then((att) =>
				att.map((row) => row.id)
			);
			const isExists = subcategoryData.attributes.every((data) => findAllAttributes.includes(data));
			if (isExists == false) {
				return res.api.validationErrors({ message: "One or more attribute is not available" });
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
			return res.api.create(data);
		},
	};

	public getSubCategoryAttributes = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const subcategoryId: string = req.params["id"] as string;
			const subcategoryExist = await this.service.getSubCategoryAttributes(subcategoryId);
			return res.api.create(subcategoryExist);
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
			const subcategoryExist = await this.service.simpleFindOne({
				id: { [Op.not]: subcategoryId },
				name: subcategoryData.name,
				is_deleted: false,
			});
			if (subcategoryExist && subcategoryExist != null) {
				throw new DuplicateRecord("Subcategory already exists");
			}

			const checkCategory = await this.categoryService.findOne({ id: subcategoryData.category_id });
			if (checkCategory == null) {
				throw new DuplicateRecord("Category not found");
			}

			const findAllAttributes = await Attributes.findAll({ where: { is_deleted: false }, raw: true, attributes: ["id"] }).then((att) =>
				att.map((row) => row.id)
			);
			const isExists = subcategoryData.attributes.every((data) => findAllAttributes.includes(data));
			if (isExists == false) {
				return res.api.validationErrors({ message: "One or more attribute is not available" });
			}

			const file: any = req.files;
			if (file) {
				const oldImgData = await this.service.simpleFindOne({ id: subcategoryId });
				if (file.img_url) {
					oldImgData?.img_url && (await removeFile(oldImgData.img_url));
					let profile: any = await saveFile(file.img_url, "subcategory");
					subcategoryData.img_url = profile.upload_path;
				}
				if (file.logo_url) {
					oldImgData?.logo_url && (await removeFile(oldImgData.logo_url));
					let profile: any = await saveFile(file.logo_url, "subcategory");
					subcategoryData.logo_url = profile.upload_path;
				}
			}
			const data = await this.service.edit(subcategoryId, subcategoryData);
			return res.api.create(data);
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
				.then(async () => {
					if (subCategoryExist.img_url) {
						await removeFile(subCategoryExist.img_url);
					}
					if (subCategoryExist.logo_url) {
						await removeFile(subCategoryExist.logo_url);
					}
					return res.api.create({
						message: `Subcategory deleted`,
					});
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
		},
	};
}
