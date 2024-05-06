import { NextFunction, Response, Request } from "express";
import BaseHandler from "./BaseHandler";
import Validator from "validatorjs";
import { BadResponseHandler, FormErrorsHandler } from "../../errorHandler";
import { helper } from "../../utils";
import _ from "lodash";

export default class BasicValidatorHandler extends BaseHandler {
	constructor() {
		super();
	}

	handler(validationRulesAndMessages: any) {
		return async (req: Request, res: Response, next: NextFunction) => {
			let input: any = {
				...req.body,
				...req.query,
				...req.files,
				...req.params,
			};

			let sameKeys = _.intersection(Object.keys(req.body), Object.keys(req.query || {}));

			if (sameKeys.length > 0) {
				return next(new BadResponseHandler(`${sameKeys.join(", ")} should not same in query and body`));
			}

			await this.basicInitialization(validationRulesAndMessages, input);

			let validation = new Validator(
				this.requestData,
				this.validationFormRules.rules,
				this.validationFormRules.messages != undefined ? this.validationFormRules.messages : {}
			);

			if (validation.fails()) {
				let errors = this.prepareFailedValidationErrors(validation.errors.errors);

				return next(new FormErrorsHandler(errors));
			} else if (!helper.isEmpty(this.otherCustomErrors)) {
				return next(new FormErrorsHandler(this.otherCustomErrors));
			}

			req.mergedBody = this.requestData;

			next();
		};
	}
}
