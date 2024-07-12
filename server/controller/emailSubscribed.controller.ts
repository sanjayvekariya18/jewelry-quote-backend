import { NextFunction, Request, Response } from "express";
import { EmailSubscribedService } from "../services";
import { EmailSubscribedValidation } from "../validations";
import { emailSubscribedDTO } from "../dto";
import { DuplicateRecord, NotExistHandler } from "../errorHandler";

export default class EmailSubscribedController {
	private service = new EmailSubscribedService();
	private validations = new EmailSubscribedValidation();

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new emailSubscribedDTO.SearchEmailSubscribedDTO(req.query));
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const emailSubId: string = req.params["id"] as string;
			const emailExist = await this.service.findOne({ id: emailSubId });
			if (!emailExist) {
				throw new NotExistHandler("Email Subscribed Not Found");
			}
			return res.api.create(emailExist);
		},
	};

	public create = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const email: string = req.body["email"] as string;
			const emailExist = await this.service.findOne({ email: email, is_deleted: false });
			if (emailExist != null) {
				throw new DuplicateRecord("You are already subscribed with us.");
			}

			const data = await this.service.create(email);
			return res.api.create(data);
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const emailSubId: string = req.params["id"] as string;
			const emailExist = await this.service.findOne({ id: emailSubId });
			if (!emailExist) {
				throw new NotExistHandler("Email subscribed Not Found");
			}
			await this.service
				.delete(emailSubId, req.authUser.id)
				.then(async () => {
					return res.api.create({
						message: `Email Subscribed deleted`,
					});
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
		},
	};
}
