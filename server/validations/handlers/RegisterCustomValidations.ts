import { helper } from "../../utils";
import Validator from "validatorjs";
import { validationMessages } from "./customValidationMessages";

export default class RegisterCustomValidations {
	public customValidationMessages: any = {};

	constructor() {
		this.customValidationMessages = validationMessages;
	}

	initializer() {
		this.imagesOrVideoFileTypesValidation();
		this.registerMockValidation();
		this.fileSizeValidation();
		this.checkingSizeOfFieldValueValidation();
		this.uuidValidation();
		this.gstValidation();
	}

	gstValidation() {
		Validator.register(
			"gst",
			function (value: any, requirement, attribute) {
				const uuidRegex = /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})$/;

				return uuidRegex.test(value);
			},
			this.customValidationMessages.gst
		);
	}

	uuidValidation() {
		Validator.register(
			"uuid",
			function (value: any, requirement, attribute) {
				const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

				return uuidRegex.test(value);
			},
			this.customValidationMessages.uuid
		);
	}

	imagesOrVideoFileTypesValidation() {
		Validator.register(
			"mimes",
			function (value: any, requirement, attribute) {
				if (typeof value == "string" || helper.isEmpty(value) || typeof value != "object") {
					return true;
				}

				if (value?.name == undefined) {
					return true;
				}

				const allowedExtensions = requirement ? requirement.split(",") : [];

				const fileExtension = value.name.split(".").pop();
				if (!allowedExtensions.includes(fileExtension)) {
					return false; // Invalid file type
				}
				return true;
			},
			":file_name :- must be a file of type :mime_types"
		);
	}

	registerMockValidation() {
		Validator.register(
			"max_file_size",
			function (value: any, requirement, attribute) {
				if (typeof value == "string") {
					return true;
				}

				if (value.size > Number(requirement)) {
					return false;
				}

				return true;
			},
			":file_name :- Maximum uploaded file size should be :max_size"
		);

		Validator.register(
			"min_file_size",
			function (value: any, requirement, attribute) {
				if (typeof value == "string") {
					return true;
				}

				if (value.size < Number(requirement)) {
					return false;
				}

				return true;
			},
			":file_name :- Minimum uploaded file size should be :min_size"
		);
	}

	fileSizeValidation() {
		// this validation is just for register it don't touch this please.

		Validator.register(
			"exists",
			function (value: any, requirement, attribute) {
				return true;
			},
			""
		);

		Validator.register(
			"unique",
			function (value: any, requirement, attribute) {
				return true;
			},
			""
		);
	}

	checkingSizeOfFieldValueValidation() {
		Validator.register(
			"length",
			function (value: any, requirement, attribute) {
				let _value: any = String(value);
				return _value.length == requirement;
			},
			this.customValidationMessages?.length
		);
	}
}
