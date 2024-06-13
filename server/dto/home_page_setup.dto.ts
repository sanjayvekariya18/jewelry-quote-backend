import { HOME_PAGE_SECTIONS } from "../enum";
import { AboutUsSection, BannerData, BottomSection, HomePageSetupInput, SliderSection, SpecialOffersData } from "../models";
import { uuidv4 } from "../utils/helper";

export class SliderSectionDTO implements SliderSection {
	id: string;
	title: string;
	description: string;
	button_text: string;
	button_link: string;
	image_src: string;
	file_name?: string | undefined;

	constructor(data: any) {
		data.id != undefined && data.id != "" ? (this.id = data.id) : (this.id = uuidv4());
		this.title = data.title;
		this.description = data.description;
		this.button_text = data.button_text;
		this.button_link = data.button_link;
		this.image_src = "";
		data.file_name != undefined && data.file_name != "" ? (this.file_name = data.file_name) : delete this.file_name;
	}
}

export class BannerDataDTO implements BannerData {
	id: string;
	title: string;
	banner_link: string;
	image_src: string;
	file_name?: string | undefined;

	constructor(data: any) {
		data.id != undefined && data.id != "" ? (this.id = data.id) : (this.id = uuidv4());
		this.title = data.title;
		this.banner_link = data.banner_link;
		this.image_src = "";
		data.file_name != undefined && data.file_name != "" ? (this.file_name = data.file_name) : delete this.file_name;
	}
}

export class SpecialOffersDataDTO implements SpecialOffersData {
	id: string;
	title: string;
	sub_title: string;
	image_src: string;
	file_name?: string | undefined;

	constructor(data: any) {
		data.id != undefined && data.id != "" ? (this.id = data.id) : (this.id = uuidv4());
		this.title = data.title;
		this.sub_title = data.sub_title;
		this.image_src = "";
		data.file_name != undefined && data.file_name != "" ? (this.file_name = data.file_name) : delete this.file_name;
	}
}

export class AboutUsSectionDTO implements AboutUsSection {
	title: string;
	content: string;
	image_src: string;

	constructor(data: any) {
		this.title = data.title;
		this.content = data.content;
		this.image_src = "";
	}
}

export class BottomSectionDTO implements BottomSection {
	text_content: string;
	our_expertise_img: string;
	our_vision_content: string;
	our_mission_img: string;
	our_mission_content: string;

	constructor(data: any) {
		this.our_expertise_img = "";
		this.text_content = data.text_content;
		this.our_vision_content = data.our_vision_content;
		this.our_mission_img = "";
		this.our_mission_content = data.our_mission_content;
	}
}

export class UpdateSliderSectionDTO implements HomePageSetupInput {
	section: string = HOME_PAGE_SECTIONS.SLIDER_SECTION;
	value: SliderSection[];
	last_updated_by: string;

	constructor(data: any) {
		this.value = data.sliders.map((row: any) => new SliderSectionDTO(row));
		this.last_updated_by = data.loggedInUserId;
	}
}

export class UpdateBannerDataDTO implements HomePageSetupInput {
	section: string = HOME_PAGE_SECTIONS.BANNER_SECTION;
	value: BannerData[];
	last_updated_by: string;

	constructor(data: any) {
		this.value = data.banners.map((row: any) => new BannerDataDTO(row));
		this.last_updated_by = data.loggedInUserId;
	}
}

export class UpdateSpecialOffersDataDTO implements HomePageSetupInput {
	section: string = HOME_PAGE_SECTIONS.SPECIAL_OFFERS;
	value: SpecialOffersData[];
	last_updated_by: string;

	constructor(data: any) {
		this.value = data.offers.map((row: any) => new SpecialOffersDataDTO(row));
		this.last_updated_by = data.loggedInUserId;
	}
}

export class UpdateAboutUsSectionDTO implements HomePageSetupInput {
	section: string = HOME_PAGE_SECTIONS.ABOUT_US_SECTION;
	value: AboutUsSection;
	last_updated_by: string;

	constructor(data: any) {
		this.value = new AboutUsSectionDTO(data);
		this.last_updated_by = data.loggedInUserId;
	}
}

export class UpdateOurCategorySectionDTO implements HomePageSetupInput {
	section: string = HOME_PAGE_SECTIONS.OUR_CATEGORY_SECTION;
	value: BannerData[];
	last_updated_by: string;

	constructor(data: any) {
		this.value = data.categories.map((row: any) => new BannerDataDTO(row));
		this.last_updated_by = data.loggedInUserId;
	}
}

export class UpdateBottomSectionDTO implements HomePageSetupInput {
	section: string = HOME_PAGE_SECTIONS.BOTTOM_SECTION;
	value: BottomSection;
	last_updated_by: string;

	constructor(data: any) {
		this.value = new BottomSectionDTO(data);
		this.last_updated_by = data.loggedInUserId;
	}
}
