import { NextFunction, Response, Request } from "express";
import BaseHandler from "./BaseHandler";
import Validator from "validatorjs";
import { FormErrorsHandler } from "../../errorHandler";
import { helper } from "../../utils";

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

            next();
        };
    }
}
