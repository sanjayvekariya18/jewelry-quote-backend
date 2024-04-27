import { NextFunction, Request, Response } from "express";
import { CatalogService } from "../services";
import { CatalogValidations } from "../validations";
import { CreateCatalogDTO, SearchCatalogDTO } from "../dto";
import { DuplicateRecord, NotExistHandler } from "../errorHandler";
import { removeFile, saveFile } from "../utils/helper";
import { CatalogMaster } from "../models";
import { Op } from "sequelize";

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

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const catalogId: string = req.params["id"] as string;
			const catalogExist = await CatalogMaster.findByPk(catalogId, { attributes: ["id", "name", "description", "img_url", "pdf_url"] });
			if (!catalogExist) {
				throw new NotExistHandler("Catalog Master Not Found");
			}
			const data = await this.service.findOne(catalogId);
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const catalogData = new CreateCatalogDTO(req.body);
			const catalogExist = await this.service.findOne({ name: catalogData.name, is_deleted: false });

			if (catalogExist && catalogExist != null) {
				throw new DuplicateRecord("Catalog Master already exists");
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
			const catalogData = new CreateCatalogDTO(req.body);
			const catalogDuplicateExist = await this.service.findOne({
				id: { [Op.not]: catalog_id },
				name: catalogData.name,
				is_deleted: false,
			});

			if (catalogDuplicateExist && catalogDuplicateExist != null) {
				throw new DuplicateRecord("Catalog master already exists");
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
