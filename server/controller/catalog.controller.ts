import { NextFunction, Request, Response } from "express";
import { CatalogService } from "../services";
import { CatalogValidations } from "../validations";
import { CreateCatalogDTO, emailSubscribedDTO, SearchCatalogDTO, SearchCustomerCatalogDTO } from "../dto";
import { DuplicateRecord, NotExistHandler } from "../errorHandler";
import { removeFile, saveFile } from "../utils/helper";
import { Op } from "sequelize";
import { CatalogMaster, Products } from "../models";
import { config } from "../config";
import ValidationHandler from "../errorHandler/validation.error.handler";
const fs = require("fs");

export default class CatalogController {
	private service = new CatalogService();
	private validations = new CatalogValidations();

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchCatalogDTO(req.query));
			return res.api.create(data);
		},
	};

	public getAllForCustomer = {
		validation: this.validations.getAllForCustomer,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAllForCustomer(new SearchCustomerCatalogDTO(req.query));
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const catalogId: string = req.params["id"] as string;
			const catalogExist = await this.service.findOne({ id: catalogId });
			if (!catalogExist) {
				throw new NotExistHandler("Catalog Master Not Found");
			}
			return res.api.create(catalogExist);
		},
	};

	public pdfDownload = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const categoryId: string = req.params["id"] as string;
			const categoryExist = await CatalogMaster.findByPk(categoryId);
			if (!categoryExist) {
				throw new NotExistHandler("Catalog Not Found");
			}

			if (!categoryExist.pdf_url) {
				throw new NotExistHandler("Pdf Not Found");
			}

			let pdfPath = config.file_path + categoryExist.pdf_url;

			let existFile = fs.existsSync(pdfPath);
			if (!existFile) {
				throw new ValidationHandler("Pdf not found");
			}

			const fileContent = fs.readFileSync(pdfPath);
			res.setHeader("Content-Disposition", `attachment; filename=${categoryExist?.name}.pdf`);
			res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			res.send(fileContent);
		},
	};

	public findOneForCustomer = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const catalogId: string = req.params["id"] as string;
			const customer_id: string = req.customer.id;
			const catalogExist = await this.service.findOneForCustomer({ id: catalogId }, customer_id);
			if (!catalogExist) {
				throw new NotExistHandler("Catalog Master Not Found");
			}
			return res.api.create(catalogExist);
		},
	};

	public create = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const catalogData = new CreateCatalogDTO(req.mergedBody);
			const catalogExist = await this.service.findOne({ name: catalogData.name, is_deleted: false });
			if (catalogExist && catalogExist != null) {
				throw new DuplicateRecord("Catalog Master already exists");
			}

			if (catalogData.catalog_products && catalogData.catalog_products?.length > 0) {
				const getAllProducts = await Products.findAll({ where: { is_deleted: false }, attributes: ["id"], raw: true }).then((product) =>
					product.map((row) => row.id)
				);
				const isExists = catalogData.catalog_products.every((data) => getAllProducts.includes(data));
				if (isExists == false) {
					return res.api.validationErrors({ message: "One or more product is not available" });
				}
			}

			const file: any = req.files;
			if (file) {
				if (file.img_url) {
					let uploadedImg: any = await saveFile(file.img_url, "catalog");
					catalogData.img_url = uploadedImg.upload_path;
				}
				if (file.pdf_url) {
					let uploadedImg: any = await saveFile(file.pdf_url, "catalog");
					catalogData.pdf_url = uploadedImg.upload_path;
				}
			}
			const data = await this.service.create(catalogData);
			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const catalog_id: string = req.params["id"] as string;
			const catalogExist = await this.service.findOne({ id: catalog_id, is_deleted: false });
			if (!catalogExist) {
				throw new NotExistHandler("Catalog master Not Found");
			}
			const catalogData = new CreateCatalogDTO(req.mergedBody);
			const catalogDuplicateExist = await this.service.findOne({
				id: { [Op.not]: catalog_id },
				name: catalogData.name,
				is_deleted: false,
			});

			if (catalogDuplicateExist && catalogDuplicateExist != null) {
				throw new DuplicateRecord("Catalog master already exists");
			}

			if (catalogData.catalog_products && catalogData.catalog_products?.length > 0) {
				const getAllProducts = await Products.findAll({ where: { is_deleted: false }, attributes: ["id"], raw: true }).then((product) =>
					product.map((row) => row.id)
				);
				const isExists = catalogData.catalog_products.every((data) => getAllProducts.includes(data));
				if (isExists == false) {
					return res.api.validationErrors({ message: "One or more product is not available" });
				}
			}

			const file: any = req.files;
			if (file) {
				const oldImgData = await this.service.findOne({ id: catalog_id });
				if (file.img_url) {
					oldImgData?.img_url && (await removeFile(oldImgData.img_url));
					let uploadedImg: any = await saveFile(file.img_url, "catalog");
					catalogData.img_url = uploadedImg.upload_path;
				}
				if (file.pdf_url) {
					oldImgData?.pdf_url && (await removeFile(oldImgData.pdf_url));
					let uploadedImg: any = await saveFile(file.pdf_url, "catalog");
					catalogData.pdf_url = uploadedImg.upload_path;
				}
			}
			const data = await this.service.edit(catalog_id, catalogData);
			return res.api.create(data);
		},
	};

	public toggleCatalogActive = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const catalog_id: string = req.params["id"] as string;
			const catalogExist = await this.service.findOne({ id: catalog_id, is_deleted: false });

			if (!catalogExist) {
				throw new NotExistHandler("Catalog Not Found");
			}
			await this.service
				.toggleCatalogActive(catalog_id, req.authUser.id)
				.then((flag) => {
					res.api.create({
						message: `Catalog is ${flag?.is_active ? "Actived" : "Deactivated"}`,
					});
				})
				.catch((error) => {
					res.api.serverError(error);
				});
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const catalog_id: string = req.params["id"] as string;
			const catalogExist = await this.service.findOne({ id: catalog_id });
			if (!catalogExist) {
				throw new NotExistHandler("Catalog Master Not Found");
			}
			await this.service
				.delete(catalog_id, req.authUser.id)
				.then(async () => {
					if (catalogExist.img_url) await removeFile(catalogExist.img_url);
					if (catalogExist.pdf_url) await removeFile(catalogExist.pdf_url);
					return res.api.create({
						message: `Catalog deleted`,
					});
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
		},
	};
}
