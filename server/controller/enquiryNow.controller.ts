import { NextFunction, Request, Response } from "express";
import { enquiryNowDTO } from "../dto";
import { CustomerDetailsService, EmailService, EnquiryNowService } from "../services";
import { EnquiryNowValidations } from "../validations";
import { NotExistHandler, PermissionDeniedHandler } from "../errorHandler";
import { config } from "../config";

export default class EnquiryNowController {
	private service = new EnquiryNowService();
	private validations = new EnquiryNowValidations();
	private customerDetailsService = new CustomerDetailsService();
	private emailService = new EmailService();

	public getAll = {
		validation: this.validations.getAll,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll(new enquiryNowDTO.SearchEnquiryNowDTO(req.query));
			return res.api.create(data);
		},
	};

	public create = {
		validation: this.validations.create,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const enquiryData = new enquiryNowDTO.CreateEnquiryNowDTO(req.body);
			const authUser = req?.customer?.id;
			if (!authUser) {
				throw new PermissionDeniedHandler("Permission denied");
			}

			const findCustomer = await this.customerDetailsService.findOne({ id: authUser });

			if (findCustomer == null) {
				throw new NotExistHandler("Customer Not Found");
			}
			enquiryData.customer_id = authUser;
			return await this.service.create(enquiryData).then(async (data) => {
				const admin_email = config.send_notification_email;

				this.emailService.sendEnquiryThankYouToCustomer({ customer_name: data?.CustomerDetail?.customer_name }, enquiryData.email);
				this.emailService.sendEnquiryUpdateToAdmin(
					{
						customer_name: data?.CustomerDetail?.customer_name,
						email: enquiryData.email,
						contact_number: enquiryData.contact_number,
						product_ids: enquiryData.product_ids,
						createdAt: data?.createdAt,
						notes: enquiryData.notes,
					},
					admin_email
				);
				return res.api.create("Your enquiry has been successfully submitted.");
			});
		},
	};

	public toggleEnquiryIsRead = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const enquiry_id: string = req.params["id"] as string;
			const enquiryExist = await this.service.findOne({ id: enquiry_id, is_deleted: false });

			if (!enquiryExist) {
				throw new NotExistHandler("Enquiry Not Found");
			}
			await this.service
				.toggleEnquiryIsRead(enquiry_id, req.authUser.id)
				.then((flag) => {
					res.api.create({ message: `Enquiry is ${flag?.is_read ? "read" : "unread"}` });
				})
				.catch((error) => {
					res.api.serverError(error);
				});
		},
	};

	public delete = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const enquiry_id: string = req.params["id"] as string;
			const enquiryExist = await this.service.findOne({ id: enquiry_id });
			if (!enquiryExist) {
				throw new NotExistHandler("Enquiry Not Found");
			}
			await this.service
				.delete(enquiry_id, req.authUser.id)
				.then(async () => {
					return res.api.create({ message: `Enquiry deleted` });
				})
				.catch((error) => {
					return res.api.serverError(error);
				});
		},
	};
}
