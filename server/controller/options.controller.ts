import { NextFunction, Request, Response } from "express";
import { OptionsService } from "../services";
import { OptionsValidations } from "../validations";
import { OptionsDTO, SearchOptionsDTO } from "../dto";
import { DuplicateRecord, NotExistHandler, use } from "../errorHandler";
import { Op } from "sequelize";
import { Options } from "../models";

export default class OptionsController {
	private service = new OptionsService();
	private validations = new OptionsValidations();

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new SearchOptionsDTO(req.query));
			res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const userId: string = req.params["id"] as string;
			const userExist = await this.service.findOne({ id: userId });
			if (!userExist) {
				throw new NotExistHandler("User Not Found");
			}
			res.api.create(userExist);
		},
	};

	public create = {
		validation: this.validations.options,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const optionsData = new OptionsDTO(req.body);
			const optionExist = await this.service.findOne({ name: { [Op.iLike]: optionsData.name }, is_deleted: false });

			if (optionExist && optionExist != null) {
				throw new DuplicateRecord("Options name already exists");
			}
			const data = await this.service.create(optionsData);
			res.api.create(data);
		},
	};

	public edit = {
		validation: this.validations.options,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const optionsId: string = req.params["id"] as string;
			const optionExist = await Options.findByPk(optionsId);
			if (!optionExist) {
				throw new NotExistHandler("Option Not Found");
			}
			const optionsData = new OptionsDTO(req.body);

			const data = await this.service.edit(optionsId, optionsData);
			res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const optionsId: string = req.params["id"] as string;
			const optionExist = await Options.findByPk(optionsId);
			if (!optionExist) {
				throw new NotExistHandler("Option Not Found");
			}
			await this.service
				.delete(optionsId, req.authUser.id)
				.then(async () => {
					res.api.create({
						message: `Options deleted`,
					});
				})
				.catch((error) => {
					res.api.serverError(error);
				});
		},
	};
}
