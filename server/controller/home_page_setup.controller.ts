import { NextFunction, Request, Response } from "express";
import { HomePageSetupService } from "../services";
import { HomePageSetupValidations } from "../validations";
import { HOME_PAGE_SECTIONS } from "../enum";
import {
	UpdateAboutUsSectionDTO,
	UpdateBannerDataDTO,
	UpdateBottomSectionDTO,
	UpdateOurCategorySectionDTO,
	UpdateSliderSectionDTO,
	UpdateSpecialOffersDataDTO,
} from "../dto";
import { FormErrorsHandler, NotFoundHandler } from "../errorHandler";
import { AboutUsSection, BannerData, BottomSection, SliderSection, SpecialOffersData } from "../models";
import { fileType, saveFile } from "../utils/helper";

export default class HomePageSetupController {
	private service = new HomePageSetupService();
	private validations = new HomePageSetupValidations();

	public getAll = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const data = await this.service.getAll();
			return res.api.create(data);
		},
	};

	public findOne = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const section: HOME_PAGE_SECTIONS = req.params["section"].trim() as HOME_PAGE_SECTIONS;

			if (Object.values(HOME_PAGE_SECTIONS).includes(section)) {
				const data = await this.service.findOne(section);
				return res.api.create(data?.value);
			} else {
				throw new NotFoundHandler("Section not found. Valid values are " + Object.values(HOME_PAGE_SECTIONS).join(", "));
			}
		},
	};

	private getErrorForFormData = (section: HOME_PAGE_SECTIONS, array_data: Array<any>, files_data: Array<any>): Array<string> => {
		const errors: Array<string> = [];
		const image_type = ["image/png", "image/avif", "image/gif", "image/jpeg", "image/png", "image/svg+xml", "image/webp", "image/heic", "image/bmp"];

		// Image type check
		files_data.forEach((image, index) => {
			if (!fileType(image, image_type))
				errors.push(`Image at position ${index + 1} is invalid. Valid formats are ${image_type.map((row) => row.replace("image/", "")).join(", ")}`);
		});

		const file_names = files_data.map((file) => file.md5);

		if (section == HOME_PAGE_SECTIONS.SLIDER_SECTION) {
			if (array_data.length == 0) {
				errors.push("Minimum 1 slider");
			}
			for (let index = 0; index < array_data.length; index++) {
				const slider = { ...array_data[index] } as SliderSection;
				if (slider.title == undefined) errors.push(`Title is required at position ${index + 1}`);
				if (slider.button_text == undefined) errors.push(`Button Text is required at position ${index + 1}`);
				if (slider.button_link == undefined) errors.push(`Button Link is required at position ${index + 1}`);
				if (slider.file_name && slider.file_name != "" && !file_names.includes(slider.file_name))
					errors.push(`Image not found in payload at position ${index + 1}`);
			}
		}
		if (section == HOME_PAGE_SECTIONS.BANNER_SECTION) {
			if (array_data.length != 3) {
				errors.push("3 Banners required");
			}
			for (let index = 0; index < array_data.length; index++) {
				const slider = { ...array_data[index] } as BannerData;
				if (slider.title == undefined) errors.push(`Title is required at position ${index + 1}`);
				if (slider.banner_link == undefined) errors.push(`Banner Link is required at position ${index + 1}`);
				if (slider.file_name && slider.file_name != "" && !file_names.includes(slider.file_name))
					errors.push(`Image not found in payload at position ${index + 1}`);
			}
		}
		if (section == HOME_PAGE_SECTIONS.OUR_CATEGORY_SECTION) {
			if (array_data.length > 9) {
				errors.push("Maximum 9 categories");
			}
			for (let index = 0; index < array_data.length; index++) {
				const slider = { ...array_data[index] } as BannerData;
				if (slider.title == undefined) errors.push(`Title is required at position ${index + 1}`);
				if (slider.banner_link == undefined) errors.push(`Banner Link is required at position ${index + 1}`);
				if (slider.file_name && slider.file_name != "" && !file_names.includes(slider.file_name))
					errors.push(`Image not found in payload at position ${index + 1}`);
			}
		}
		if (section == HOME_PAGE_SECTIONS.SPECIAL_OFFERS) {
			for (let index = 0; index < array_data.length; index++) {
				const slider = { ...array_data[index] } as SpecialOffersData;

				if (slider.title == undefined) errors.push(`Title is required at position ${index + 1}`);
				if (slider.sub_title == undefined) errors.push(`Sub title is required at position ${index + 1}`);
				if (slider.file_name && slider.file_name != "" && !file_names.includes(slider.file_name))
					errors.push(`Image not found in payload at position ${index + 1}`);
			}
		}

		return errors;
	};

	public updateSliderSection = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let errors: Array<string> = [];

			errors = this.getErrorForFormData(
				HOME_PAGE_SECTIONS.SLIDER_SECTION,
				req.body.sliders,
				req.files?.image != undefined ? (Array.isArray(req.files?.image) ? req.files?.image : [req.files?.image]) : []
			);

			if (errors.length > 0) {
				throw new FormErrorsHandler(errors);
			}

			const tableData = new UpdateSliderSectionDTO(req.body);

			const old_data = await this.service.findOne(HOME_PAGE_SECTIONS.SLIDER_SECTION).then((data) => {
				if (data) {
					return data.value as SliderSection[];
				}
				return undefined;
			});

			if (req.files) {
				for (const slider of tableData.value) {
					if (slider.file_name) {
						let file_to_upload = null;
						if (Array.isArray(req.files.image)) {
							const file_index = req.files.image.findIndex((row) => {
								if (row == undefined) {
									return false;
								}
								return row.md5 == slider.file_name;
							});
							if (file_index > -1) {
								file_to_upload = req.files.image[file_index];
							}
						} else if (req.files.image.md5 == slider.file_name) {
							file_to_upload = req.files.image;
						}
						if (file_to_upload) {
							await saveFile(file_to_upload, "home_page").then((file_path: any) => {
								slider.image_src = file_path.upload_path;
							});
						}
						delete slider.file_name;
					} else if (old_data) {
						const old_slider_index = old_data.findIndex((row) => row.id == slider.id);
						if (old_slider_index > -1) {
							slider.image_src = old_data[old_slider_index].image_src;
						}
					}
				}
			}

			const data = await this.service.update(tableData);
			return res.api.create(data);
		},
	};

	public updateBannerData = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let errors: Array<string> = [];

			errors = this.getErrorForFormData(
				HOME_PAGE_SECTIONS.BANNER_SECTION,
				req.body.banners,
				req.files?.image != undefined ? (Array.isArray(req.files?.image) ? req.files?.image : [req.files?.image]) : []
			);

			if (errors.length > 0) {
				throw new FormErrorsHandler(errors);
			}

			const tableData = new UpdateBannerDataDTO(req.body);

			const old_data = await this.service.findOne(HOME_PAGE_SECTIONS.BANNER_SECTION).then((data) => {
				if (data) {
					return data.value as BannerData[];
				}
				return undefined;
			});

			if (req.files) {
				for (const banner of tableData.value) {
					if (banner.file_name) {
						let file_to_upload = null;
						if (Array.isArray(req.files.image)) {
							const file_index = req.files.image.findIndex((row) => {
								if (row == undefined) {
									return false;
								}
								return row.md5 == banner.file_name;
							});
							if (file_index > -1) {
								file_to_upload = req.files.image[file_index];
							}
						} else if (req.files.image.md5 == banner.file_name) {
							file_to_upload = req.files.image;
						}
						if (file_to_upload) {
							await saveFile(file_to_upload, "home_page").then((file_path: any) => {
								banner.image_src = file_path.upload_path;
							});
						}

						delete banner.file_name;
					} else if (old_data) {
						const old_slider_index = old_data.findIndex((row) => row.id == banner.id);
						if (old_slider_index > -1) {
							banner.image_src = old_data[old_slider_index].image_src;
						}
					}
				}
			}

			const data = await this.service.update(tableData);
			return res.api.create(data);
		},
	};

	public updateAboutUsSection = {
		validation: this.validations.updateAboutUsSection,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const tableData = new UpdateAboutUsSectionDTO(req.body);

			const file: any = req.files;
			if (file.image) {
				await saveFile(file.image, "home_page").then((file_path: any) => {
					tableData.value.image_src = file_path.upload_path;
				});
			} else {
				await this.service.findOne(HOME_PAGE_SECTIONS.ABOUT_US_SECTION).then((data) => {
					if (data) {
						const old_about_us = data.value as AboutUsSection;
						tableData.value.image_src = old_about_us.image_src;
					}
				});
			}
			const data = await this.service.update(tableData);
			return res.api.create(data);
		},
	};

	public updateOurCategorySection = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let errors: Array<string> = [];

			errors = this.getErrorForFormData(
				HOME_PAGE_SECTIONS.OUR_CATEGORY_SECTION,
				req.body.categories,
				req.files?.image != undefined ? (Array.isArray(req.files?.image) ? req.files?.image : [req.files?.image]) : []
			);

			if (errors.length > 0) {
				throw new FormErrorsHandler(errors);
			}

			const tableData = new UpdateOurCategorySectionDTO(req.body);

			const old_data = await this.service.findOne(HOME_PAGE_SECTIONS.OUR_CATEGORY_SECTION).then((data) => {
				if (data) {
					return data.value as BannerData[];
				}
				return undefined;
			});

			if (req.files) {
				for (const category of tableData.value) {
					if (category.file_name) {
						let file_to_upload = null;
						if (Array.isArray(req.files.image)) {
							const file_index = req.files.image.findIndex((row) => {
								if (row == undefined) {
									return false;
								}
								return row.md5 == category.file_name;
							});
							if (file_index > -1) {
								file_to_upload = req.files.image[file_index];
							}
						} else if (req.files.image.md5 == category.file_name) {
							file_to_upload = req.files.image;
						}
						if (file_to_upload) {
							await saveFile(file_to_upload, "home_page").then((file_path: any) => {
								category.image_src = file_path.upload_path;
							});
						}
						delete category.file_name;
					} else if (old_data) {
						const old_slider_index = old_data.findIndex((row) => row.id == category.id);
						if (old_slider_index > -1) {
							category.image_src = old_data[old_slider_index].image_src;
						}
					}
				}
			}

			const data = await this.service.update(tableData);
			return res.api.create(data);
		},
	};

	public updateBottomSection = {
		validation: this.validations.updateBottomSection,
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			const tableData = new UpdateBottomSectionDTO(req.body);

			const file: any = req.files;
			if (file.image) {
				await saveFile(file.image, "home_page").then((file_path: any) => {
					tableData.value.our_expertise_img = file_path.upload_path;
				});
			} else {
				await this.service.findOne(HOME_PAGE_SECTIONS.BOTTOM_SECTION).then((data) => {
					if (data) {
						const old_about_us = data.value as BottomSection;
						tableData.value.our_expertise_img = old_about_us.our_expertise_img;
					}
				});
			}
			if (file.image1) {
				await saveFile(file.image1, "home_page").then((file_path: any) => {
					tableData.value.our_mission_img = file_path.upload_path;
				});
			} else {
				await this.service.findOne(HOME_PAGE_SECTIONS.BOTTOM_SECTION).then((data) => {
					if (data) {
						const old_about_us = data.value as BottomSection;
						tableData.value.our_mission_img = old_about_us.our_mission_img;
					}
				});
			}

			const data = await this.service.update(tableData);
			return res.api.create(data);
		},
	};

	public updateSpecialOffersData = {
		controller: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			let errors: Array<string> = [];

			errors = this.getErrorForFormData(
				HOME_PAGE_SECTIONS.SPECIAL_OFFERS,
				req.body.offers,
				req.files?.image != undefined ? (Array.isArray(req.files?.image) ? req.files?.image : [req.files?.image]) : []
			);

			if (errors.length > 0) {
				throw new FormErrorsHandler(errors);
			}

			const tableData = new UpdateSpecialOffersDataDTO(req.body);

			const old_data = await this.service.findOne(HOME_PAGE_SECTIONS.SPECIAL_OFFERS).then((data) => {
				if (data) {
					return data.value as SpecialOffersData[];
				}
				return undefined;
			});

			if (req.files) {
				for (const offers of tableData.value) {
					if (offers.file_name) {
						let file_to_upload = null;
						if (Array.isArray(req.files.image)) {
							const file_index = req.files.image.findIndex((row) => {
								if (row == undefined) {
									return false;
								}
								return row.md5 == offers.file_name;
							});
							if (file_index > -1) {
								file_to_upload = req.files.image[file_index];
							}
						} else if (req.files.image.md5 == offers.file_name) {
							file_to_upload = req.files.image;
						}
						if (file_to_upload) {
							await saveFile(file_to_upload, "home_page").then((file_path: any) => {
								offers.image_src = file_path.upload_path;
							});
						}

						delete offers.file_name;
					} else if (old_data) {
						const old_slider_index = old_data.findIndex((row) => row.id == offers.id);
						if (old_slider_index > -1) {
							offers.image_src = old_data[old_slider_index].image_src;
						}
					}
				}
			}

			const data = await this.service.update(tableData);
			return res.api.create(data);
		},
	};
}
