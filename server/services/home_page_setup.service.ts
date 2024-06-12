import {
	UpdateAboutUsSectionDTO,
	UpdateBannerDataDTO,
	UpdateBottomSectionDTO,
	UpdateOurCategorySectionDTO,
	UpdateSliderSectionDTO,
	UpdateSpecialOffersDataDTO,
} from "../dto";
import { HOME_PAGE_SECTIONS } from "../enum";
import { HomePageSetup } from "../models";

export default class HomePageSetupService {
	public getAll = async () => {
		return await HomePageSetup.findAll({
			attributes: ["id", "section", "value"],
			raw: true,
		});
	};

	public findOne = async (section: HOME_PAGE_SECTIONS) => {
		return await HomePageSetup.findOne({
			where: { section },
			attributes: ["id", "section", "value"],
			raw: true,
		});
	};

	public update = async (
		tableData:
			| UpdateAboutUsSectionDTO
			| UpdateBannerDataDTO
			| UpdateSpecialOffersDataDTO
			| UpdateBottomSectionDTO
			| UpdateOurCategorySectionDTO
			| UpdateSliderSectionDTO
	) => {
		return await HomePageSetup.update(tableData, { where: { section: tableData.section } }).then(async () => {
			return await this.findOne(tableData.section as HOME_PAGE_SECTIONS);
		});
	};
}
