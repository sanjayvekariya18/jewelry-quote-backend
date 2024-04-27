import { NextFunction, Request, Response } from "express";
import { AttributesService } from "../services";
import { AttributesValidations } from "../validations";
import { AttributesDTO, SearchAttributesDTO } from "../dto";
import { Op } from "sequelize";
import { DuplicateRecord, NotExistHandler } from "../errorHandler";
import { Attributes } from "../models";

export default class AttributesController {
	private service = new AttributesService();
	private validations = new AttributesValidations();

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchAttributesDTO(req.query));
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const attributeId: string = req.params["id"] as string;
			const attributeExist = await Attributes.findByPk(attributeId);
			if (!attributeExist) {
				throw new NotExistHandler("Attribute Not Found");
			}
			const data = await this.service.findOne({ id: attributeId });
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.validations.attributes,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const attributesData = new AttributesDTO(req.body);
			const attributesExist = await this.service.findOne({ name: { [Op.like]: attributesData.name }, is_deleted: false });

			if (attributesExist && attributesExist != null) {
				throw new DuplicateRecord("Attributes name already exists");
			}

			const data = await this.service.create(attributesData);
			return res.api.create(data);
		},
	};

	public edit = {
		validation: this.validations.attributes,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const attributesId: string = req.params["id"] as string;
			const attributeExist = await Attributes.findByPk(attributesId);
			if (!attributeExist) {
				throw new NotExistHandler("Attribute Not Found");
			}
			const attributesData = new AttributesDTO(req.body);
			const attributesExist = await this.service.findOne({
				id: { [Op.not]: attributesId },
				name: { [Op.like]: attributesData.name },
				is_deleted: false,
			});

			if (attributesExist && attributesExist != null) {
				throw new DuplicateRecord("Attributes name already exists");
			}
			const data = await this.service.edit(attributesId, attributesData);
			return res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const attributesId: string = req.params["id"] as string;
			const attributeExist = await Attributes.findByPk(attributesId);
			if (!attributeExist) {
				throw new NotExistHandler("Attribute Not Found");
			}

			await this.service
				.delete(attributesId, req.authUser.id)
				.then(() => {
					return res.api.create({
						message: `Attributes deleted`,
					});
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
		},
	};
}
