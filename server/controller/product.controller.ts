import { NextFunction, Request, Response } from "express";
import { ProductService, SubcategoryService } from "../services";
import { ProductValidation } from "../validations";
import { SearchProductDTO, ProductDTO } from "../dto";
import { DuplicateRecord, NotExistHandler } from "../errorHandler";
import { OtherDetailMaster, Products, StyleMaster, SubCategoryAttributes } from "../models";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";

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

	public getAllForCustomer = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAllForCustomer(new SearchProductDTO(req.query));
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const product_id: string = req.params["id"] as string;
			const productExist = await this.service.simpleFindOne({ id: product_id, is_deleted: false });
			if (!productExist) {
				throw new NotExistHandler("Product Not Found");
			}
			const data = await this.service.findOne({ id: product_id, is_deleted: false });
			return res.api.create(data);
		},
	};

	public getFilesByProductStockId = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const stock_id: string = req.params["stock_id"] as string;

			const getFileType = (fileName: string) => {
				const ext = path.extname(fileName).toLowerCase();
				if (ext === ".jpg" || ext === ".png" || ext === ".gif" || ext === ".jpeg" || ext === ".webp") {
					return "image";
				} else if (ext === ".mp4" || ext === ".avi" || ext === ".mov") {
					return "video";
				}
				return "unknown";
			};

			// Function to list files and determine their types
			const listFilesInFolder = (folderPath: string) => {
				let _folderPath = `public/${folderPath}`;
				const files = fs.readdirSync(_folderPath);

				const fileObjects: Array<{ fileUrl: string; fileType: string }> = [];

				files.forEach((fileName) => {
					if (fs.lstatSync(`${_folderPath}/${fileName}`).isFile()) {
						const filePath = path.join(`/${folderPath}`, fileName);
						const fileType = getFileType(fileName);

						fileObjects.push({
							fileUrl: filePath,
							fileType,
						});
					}
				});

				return fileObjects;
			};

			let files: Array<{ fileUrl: string; fileType: string }> = [];
			let mainFilePath = `public/productsFiles/${stock_id}`;
			let existMainFile = fs.existsSync(mainFilePath);
			if (existMainFile) files = listFilesInFolder(`productsFiles/${stock_id}`);
			else files = [];

			return res.api.create(files);
		},
	};

	public create = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const productData = new ProductDTO(req.body);

			const checkStockIdExists = await this.service.simpleFindOne({ stock_id: productData.stock_id });
			if (checkStockIdExists) throw new DuplicateRecord("Stock id already exists");

			const subcategoryExist = await this.subcategoryService.simpleFindOne({ id: productData.sub_category_id, is_deleted: false });
			if (subcategoryExist == null) throw new NotExistHandler("Subcategory not found");

			const error = [];
			if (productData.style) {
				const checkStyle = await StyleMaster.findOne({ where: { name: productData.style } });
				if (checkStyle == null) error.push("style");
			}
			if (productData.setting_type) {
				const checkStyle = await StyleMaster.findOne({ where: { name: productData.setting_type } });
				if (checkStyle == null) error.push("setting type");
			}
			if (productData.sub_setting) {
				const checkStyle = await StyleMaster.findOne({ where: { name: productData.sub_setting } });
				if (checkStyle == null) error.push("sub setting");
			}
			if (error.length > 0) return res.api.validationErrors({ message: `${error.join(", ")} not found` });

			let subCategoryids = await SubCategoryAttributes.findAll({
				where: { sub_category_id: productData.sub_category_id },
				attributes: ["attribute_id"],
				raw: true,
			}).then((subCatAtt) => subCatAtt.map((row) => row.attribute_id));

			productData.attributeOptions = productData.attributeOptions.filter((attOps) => subCategoryids.includes(attOps.attribute_id));
			if (productData.attributeOptions.length == 0) {
				return res.api.validationErrors({ message: "Attributes not found in sub category" });
			}

			const otherDetailIds = await OtherDetailMaster.findAll({ attributes: ["id"], raw: true }).then((othDet) => othDet.map((row) => row.id));
			const otherDetailExists = productData.otherDetails.every((attOps) => otherDetailIds.includes(attOps.other_detail_id));
			if (otherDetailExists == false) {
				return res.api.validationErrors({ message: "One or more Other detail not found" });
			}

			const data = await this.service.create(productData);
			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const productId: string = req.params["id"] as string;
			const productExist = await this.service.simpleFindOne({ id: productId, is_deleted: false });
			if (!productExist) {
				throw new NotExistHandler("Product Not Found");
			}
			const productData = new ProductDTO(req.body);

			const checkStockIdExists = await this.service.simpleFindOne({ id: { [Op.not]: productId }, stock_id: productData.stock_id });
			if (checkStockIdExists) {
				throw new DuplicateRecord("Stock id already exists");
			}

			const subcategoryExist = await this.subcategoryService.simpleFindOne({ id: productData.sub_category_id, is_deleted: false });
			if (subcategoryExist && subcategoryExist == null) {
				throw new NotExistHandler("Subcategory not found");
			}

			const error = [];
			if (productData.style) {
				const checkStyle = await StyleMaster.findOne({ where: { name: productData.style } });
				if (checkStyle == null) error.push("style");
			}
			if (productData.setting_type) {
				const checkStyle = await StyleMaster.findOne({ where: { name: productData.setting_type } });
				if (checkStyle == null) error.push("setting type");
			}
			if (productData.sub_setting) {
				const checkStyle = await StyleMaster.findOne({ where: { name: productData.sub_setting } });
				if (checkStyle == null) error.push("sub setting");
			}
			if (error.length > 0) return res.api.validationErrors({ message: `${error.join(", ")} not found` });

			let subCategoryIds = await SubCategoryAttributes.findAll({
				where: { sub_category_id: productData.sub_category_id },
				attributes: ["attribute_id"],
				raw: true,
			}).then((subCatAtt) => subCatAtt.map((row) => row.attribute_id));

			productData.attributeOptions = productData.attributeOptions.filter((attOps) => subCategoryIds.includes(attOps.attribute_id));
			if (productData.attributeOptions.length == 0) {
				return res.api.validationErrors({ message: "Attributes not found in sub category" });
			}

			const otherDetailIds = await OtherDetailMaster.findAll({ attributes: ["id"], raw: true }).then((othDet) => othDet.map((row) => row.id));
			const otherDetailExists = productData.otherDetails.every((attOps) => otherDetailIds.includes(attOps.other_detail_id));
			if (otherDetailExists == false) {
				return res.api.validationErrors({ message: "One or more Other detail not found" });
			}

			const data = await this.service.edit(productId, productData);
			return res.api.create(data);
		},
	};

	public toggleProductActive = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const product_id: string = req.params["id"] as string;
			const productExist = await this.service.simpleFindOne({ id: product_id, is_deleted: false });

			if (!productExist) {
				throw new NotExistHandler("Product Not Found");
			}
			await this.service
				.toggleProductActive(product_id, req.authUser.id)
				.then((flag) => {
					return res.api.create({
						message: `Product is ${flag?.is_active ? "Actived" : "Deactivated"}`,
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
			const productExist = await this.service.simpleFindOne({ id: productId, is_deleted: false });

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
