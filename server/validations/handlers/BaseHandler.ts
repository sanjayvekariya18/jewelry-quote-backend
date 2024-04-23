import { helper } from "../../utils";
import { validationMessages } from "./customValidationMessages";
import RegisterCustomValidations from "./RegisterCustomValidations";
import { sequelizeConnection } from "../../config/database";
import { QueryTypes } from "sequelize";
import _ from "lodash";

export default class BaseHandler {
	public registerCustomValidations: RegisterCustomValidations = new RegisterCustomValidations();

	public failedValidationErrors: any = {};
	public validationFormRules: any = {};
	public requestData: any = {};
	public customValidationMessages: any = {};
	public otherCustomErrors: any = {};

	constructor() {
		this.customValidationMessages = validationMessages;

		/* register validations */
		this.registerCustomValidations.initializer();
		/* register validations */
	}

	async basicInitialization(validationFormRules: any, input: any) {
		this.validationFormRules = { ...validationFormRules };
		this.requestData = input;

		this.modifyValidationRules();

		await this.otherCustomeErrorsBasedOnRequestData();
	}

	/* start modify validation rules functions */
	public modifyValidationRules() {
		this.callbackRulesInitiazer();
		this.nullableRuleInitializer();
	}

	private callbackRulesInitiazer() {
		let modifiedRules: any = {};
		let isCallbackRules: any =
			typeof this.validationFormRules?.callback == "function" && !helper.isEmpty(this.validationFormRules?.callback(this.requestData));

		if (isCallbackRules) {
			modifiedRules = this.validationFormRules?.callback(this.requestData);
			if (modifiedRules?.formRequest) {
				this.requestData = {
					...this.requestData,
					...modifiedRules?.formRequest,
				};
			}
		}

		this.validationFormRules = {
			rules: {
				...this.validationFormRules,
				...(modifiedRules?.rules && {
					...modifiedRules?.rules,
				}),
			},
		};

		if (isCallbackRules) {
			delete this.validationFormRules.rules.callback;
		}
	}

	private nullableRuleInitializer() {
		let rules: any = { ...this.validationFormRules.rules };

		let nullableFields = [];
		let newValidationRules: any = {};

		for (const key in rules) {
			let isNullableField = nullableFields.some((field: any) => key.includes(field));

			if (rules[key] && rules[key].includes("nullable") && helper.isEmpty(this.requestData[key])) {
				nullableFields.push(key);
			}

			if (false == isNullableField && !nullableFields.includes(key)) {
				newValidationRules[key] = rules[key].replace("|nullable", "").replace("nullable|", "");
			}

			if (!helper.isEmpty(this.requestData[key])) {
				newValidationRules[key] = rules[key].replace("|nullable", "").replace("nullable|", "");
			}
		}

		this.validationFormRules.rules = newValidationRules;
	}
	/* end modify validation rules functions */

	/* ---------------------------------------------------------------------------------------------------------------------- */

	/* start custom errors functions */
	public async otherCustomeErrorsBasedOnRequestData() {
		try {
			this.otherCustomErrors = {
				// this rule will check existance if record exists in database or not if not exists then return validation errors.
				// ex exists:columnName,tableName
				...(await this.existsRuleErrors()),

				// this rule will check uniqueness in database. if record exists in database or not if exists then return validation errors.
				// ex unique:columnName,tableName
				...(await this.uniqueRuleErrors()),
			};
		} catch (error: any) {
			console.log(error.message);

			helper.logInfo({
				data: error,
				type: "error",
			});
		}
	}

	private async existsRuleErrors() {
		let rules: any = this.validationFormRules.rules;

		let errors: any = {};
		let _rules = Object.entries(rules).map(([key, value]: any) => {
			return [key, value];
		});

		for await (const rule of _rules) {
			let [key, value]: any = rule;

			if (value.includes("exists")) {
				// added dynamic rules
				this.addRules(key, "uuid");

				let _data: any = value
					.split("|")
					.find((e: any) => e.includes("exists:"))
					.replace("exists:", "");

				if (_data && !helper.isEmpty(this.requestData[key])) {
					let formValueData: any = !Array.isArray(this.requestData[key]) ? [this.requestData[key]] : this.requestData[key];
					let [field, table]: any = _data.split(",");
					let records: any = await sequelizeConnection.query(
						`SELECT ${field} as _field FROM "${table}" where ${field} in (${formValueData.map((e: any) => `'${e}'`).join(",")})`,
						{ type: QueryTypes.SELECT }
					);

					if (helper.isEmpty(records)) {
						errors[key] = [`invalid ${key} ${formValueData.join(", ")}`];
					} else if (records.length != formValueData.length) {
						records = records.map((e: any) => e._field);
						errors[key] = [`invalid ${key} ${_.difference(formValueData, _.map(records, "id")).join(", ")}`];
					} else {
						console.log("exists error", records);
					}
				}
			}
		}

		return errors;
	}

	private async uniqueRuleErrors() {
		let rules: any = this.validationFormRules.rules;

		let errors: any = {};
		let _rules = Object.entries(rules).map(([key, value]: any) => {
			return [key, value];
		});

		for await (const rule of _rules) {
			let [key, value]: any = rule;

			if (value.includes("unique") && !helper.isEmpty(this.requestData[key])) {
				let _data: any = value
					.split("|")
					.find((e: any) => e.includes("unique:"))
					.replace("unique:", "");

				if (_data) {
					let formValueData: any = !Array.isArray(this.requestData[key]) ? [this.requestData[key]] : this.requestData[key];
					let [field, table]: any = _data.split(",");
					let records: any = await sequelizeConnection.query(
						`SELECT ${field} as _field FROM "${table}" where ${field} in (${formValueData.map((e: any) => `'${e}'`).join(",")})`,
						{ type: QueryTypes.SELECT }
					);

					if (!helper.isEmpty(records)) {
						errors[key] = [` ${key} already exists :- ${_.map(records, "_field").join(", ")}`];
					}
				}
			}
		}

		return errors;
	}
	/* end custom errors functions */

	/* ---------------------------------------------------------------------------------------------------------------------- */

	/* start failed validation errors */
	public prepareFailedValidationErrors(errors: any) {
		this.failedValidationErrors = errors;
		this.imageOrVideoErrors();
		this.getCustomeValidationMessages();

		return {
			...this.failedValidationErrors,
			...this.otherCustomErrors,
		};
	}

	private imageOrVideoErrors() {
		let rules: any = this.validationFormRules.rules;
		let _errors: any = {};

		let __rules = Object.entries(rules).map(([field, message]: any) => {
			return {
				field,
				message,
			};
		});

		for (let error of Object.entries(this.failedValidationErrors)) {
			let field: any = error[0];
			let errorMsgs: any = error[1];

			let _fieldName: any = field;
			let fileObj: any = {};
			if (field.includes(".")) {
				_fieldName = field.slice(0, field.indexOf("."));
				if (helper.isEmpty(this.requestData[_fieldName][field.replace(`${_fieldName}.`, "")]?.name)) {
					continue;
				}

				fileObj = this.requestData[_fieldName][field.replace(`${_fieldName}.`, "")];
			} else {
				if (helper.isEmpty(this.requestData[_fieldName]?.name)) {
					continue;
				}

				fileObj = this.requestData[_fieldName];
			}

			_errors[field] = errorMsgs.map((messages: any) => {
				let _rule = __rules.find((rule: any) => rule.field.includes(field.slice(0, field.indexOf("."))) && rule.message.includes("mimes"));

				if (messages.includes(":mime_types")) {
					let attributeMimeTypes = _rule?.message
						.split("|")
						.find((e: any) => e.includes("mimes"))
						.replace("mimes:", "");

					messages = messages.replace(":mime_types", attributeMimeTypes).replace(":file_name", fileObj.name || "");
				}

				if (messages.includes(":max_size")) {
					let attributeValue = _rule?.message
						.split("|")
						.find((e: any) => e.includes("max_file_size"))
						.replace("max_file_size:", "");

					messages = messages.replace(":max_size", helper.formatBytes(attributeValue)).replace(":file_name", fileObj.name || "");
				}

				if (messages.includes(":min_size")) {
					let attributeValue = _rule?.message
						.split("|")
						.find((e: any) => e.includes("min_file_size"))
						.replace("min_file_size:", "");

					messages = messages.replace(":min_size", helper.formatBytes(attributeValue)).replace(":file_name", fileObj.name || "");
				}

				messages = messages.replace(field, field.slice(0, field.indexOf(".")));

				return messages;
			});
		}

		this.failedValidationErrors = {
			...this.failedValidationErrors,
			..._errors,
		};
	}

	/* 
           description :- This function is used for set dynamically added value in the messages 
           ex :- {
            phoneNo :- 'length:10,25'
           }

           the messages for this length validation we have defined like below
           defined message :- Size length must be :_min :_max

           this function will replace :_min with 10 and :_max with 25 so out actual result will be below
           actual message :- Size length must be 10 25

           Note:- be carefull with :_ this will compulsary for replace dynamic value.
        */
	private getCustomeValidationMessages() {
		let rules: any = this.validationFormRules.rules;

		function* getAttributeByRuleGenerator(key: any, rule: any) {
			let _rule = rules[key].split("|").find((e: any) => e.includes(rule));

			if (!helper.isEmpty(_rule)) {
				yield* _rule.replace(`${rule}:`, "").split(",");
			}
		}

		const customValidationMessages: any = Object.entries(validationMessages).map(([rule, message]) => ({
			rule,
			message,
		}));

		Object.entries(this.failedValidationErrors).forEach(([key, _errors]: any) => {
			this.failedValidationErrors[key] = _errors.map((error: any) => {
				let _validationObj = customValidationMessages.find((item: any) => item.message == error);

				if (_validationObj) {
					let attribute: any = getAttributeByRuleGenerator(key, _validationObj.rule);
					return error
						.replace(/  +/g, " ")
						.split(" ")
						.map((_item: any) => {
							if (_item.includes(":_")) {
								let result: any = attribute.next();
								return !result.done ? result.value : _item;
							}

							return _item;
						})
						.join(" ");
				}

				return error;
			});
		});

		return this.failedValidationErrors;
	}
	/* end failed validation errors */

	/* other helpers */
	private addRules(field: any, rules: any) {
		// you can use this function for adding any type of dynamic rules
		// ex this.addRules('orderIds', ['uuid'])

		if (!helper.isEmpty(rules)) {
			let _rules = { ...rules };
			if (typeof rules == "string") {
				_rules = [rules];
			}

			if (!helper.isEmpty(this.validationFormRules.rules[field])) {
				_rules.forEach((rule: any) => {
					this.validationFormRules.rules[field] = `${this.validationFormRules.rules[field]}|${rule}`;
				});
			}
		} else {
			console.error(`${field} rules not defined`);
		}
	}
	/* other helpers */
}
