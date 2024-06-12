import { Transaction } from "sequelize";
import { HomePageSetup, HomePageSetupInput, SliderSection } from "../../models";
import { HOME_PAGE_SECTIONS } from "../../enum";
import { logger } from "../../config";
import { uuidv4 } from "../../utils/helper";

const slider_section = [
	{
		id: uuidv4(),
		title: "Try the exclusive collection ever that makes you feel heavenly.",
		description:
			"Mara. Ambistat proskade tempofiering, reamatisk megaosmos. Memil galna chips-sjukans till IVPA. Näringslots fronta varat i kameratelefon liksom giganing. Mara. Ambistat proskade tempofiering, reamatisk megaosmos. Memil galna chips-sjukans till IVPA. Näringslots fronta varat i kameratelefon liksom giganing.",
		button_text: "Register Now",
		button_link: "/registration",
		image_src: "",
	},
];

const banner_section = [
	{
		id: uuidv4(),
		title: "Bridle Collection",
		banner_link: "",
		image_src: "",
	},
	{
		id: uuidv4(),
		title: "Open Setting",
		banner_link: "",
		image_src: "",
	},
	{
		id: uuidv4(),
		title: "Close Setting",
		banner_link: "",
		image_src: "",
	},
];

const about_us_section = {
	title: "Welcome to Venezia Jewels",
	content: `Welcome to Venezia Jewels, your premier destination for exquisite diamond jewellery in Dubai. With nearly three decades of experience, we have been proudly serving our discerning clientele with unparalleled craftsmanship, timeless designs, and unmatched expertise. Established in 1991, our journey began with a vision to redefine luxury in the heart of Mumbai’s vibrant jewellery scene. Fast forward to 2024, we have expertise of work in India and UAE with products ranging from Plain Gold, Diamond, and Lab Grown Diamond Jewellery.

Over the years, we have earned a reputation for excellence, consistently delivering the finest quality diamonds and exceptional customer service. At Venezia Jewels, we believe that every piece of jewellery tells a unique story. From breathtaking engagement rings to elegant necklaces and stunning bracelets, each creation in our collection is meticulously crafted to reflect the essence of sophistication and elegance.

Our commitment to excellence extends beyond our products. We strive to provide a personalized shopping experience tailored to your individual preferences and desires. Whether you are searching for the perfect engagement ring or a memorable gift for a loved one, our team of experts is dedicated to helping you find the perfect piece that resonates with your style and personality. As a family-owned business, we take pride in our heritage and values. Integrity, authenticity, and trust are the pillars upon which we have built our legacy, and they guide everything we do.


We source our diamonds ethically and responsibly, ensuring that each stone meets the highest standards of quality and craftsmanship. Beyond our dedication to craftsmanship and customer service, we are deeply committed to giving back to our community. Through various philanthropic initiatives and partnerships, we strive to make a positive impact on the lives of those around us, embodying the spirit of generosity and compassion. Thank you for choosing Venezia Jewels as your trusted partner in celebrating life's most precious moments. We look forward to helping you create memories that will last a lifetime. Sincerely, Venezia Jewels DMCC`,
	image_src: "",
};

const our_category_section = [
	{
		id: uuidv4(),
		title: "Bracelet",
		banner_link: "",
		image_src: "",
	},
	{
		id: uuidv4(),
		title: "Earring",
		banner_link: "",
		image_src: "",
	},
	{
		id: uuidv4(),
		title: "Necklace",
		banner_link: "",
		image_src: "",
	},
	{
		id: uuidv4(),
		title: "Pendant",
		banner_link: "",
		image_src: "",
	},
	{
		id: uuidv4(),
		title: "Ring",
		banner_link: "",
		image_src: "",
	},
];

const bottom_section = {
	text_content: "",
	our_expertise_img: "",
	our_vision_content: "Empowering Elegance, Illuminating Partnerships: Redefining Luxury for a Global Stage.",
	our_mission_content:
		"Our mission at Venezia Jewels is to curate and deliver the epitome of luxury through our exquisite diamond jewellery, meticulously crafted to perfection. With a steadfast dedication to quality, innovation, and integrity, we strive to exceed the expectations of our B2B partners and clients alike, fostering enduring relationships built on trust and excellence. Guided by our passion for timeless elegance and inspired by the vibrant spirit of Dubai, we aim to illuminate the world with the brilliance of our creations, setting new standards of sophistication and allure in the diamond jewellery industry.",
};

const special_offers = [
	{ id: uuidv4(), title: "International", sub_title: "diamond certifications", image_src: "" },
	{ id: uuidv4(), title: "Experience of", sub_title: "3 Generations", image_src: "" },
	{ id: uuidv4(), title: "Competitive", sub_title: "prices guaranteed", image_src: "" },
	{ id: uuidv4(), title: "Unique &", sub_title: "customized design", image_src: "" },
	{ id: uuidv4(), title: "2000+ Experts", sub_title: "Craftmanship", image_src: "" },
	{ id: uuidv4(), title: "World Wide", sub_title: "trusted Brand", image_src: "" },
	{ id: uuidv4(), title: "certified", sub_title: "Natural Diamonds", image_src: "" },
];

const homePageSetupSeed = async (transaction: Transaction, adminUserId: string | undefined) => {
	const db_data = await HomePageSetup.findAll({ raw: true, transaction });
	const tableData: Array<HomePageSetupInput> = [];

	const insert_slider_section = db_data.findIndex((row) => row.section == HOME_PAGE_SECTIONS.SLIDER_SECTION) == -1;
	const insert_banner_section = db_data.findIndex((row) => row.section == HOME_PAGE_SECTIONS.BANNER_SECTION) == -1;
	const insert_about_us_section = db_data.findIndex((row) => row.section == HOME_PAGE_SECTIONS.ABOUT_US_SECTION) == -1;
	const insert_our_category_section = db_data.findIndex((row) => row.section == HOME_PAGE_SECTIONS.OUR_CATEGORY_SECTION) == -1;
	const insert_bottom_section = db_data.findIndex((row) => row.section == HOME_PAGE_SECTIONS.BOTTOM_SECTION) == -1;
	const insert_special_offers = db_data.findIndex((row) => row.section == HOME_PAGE_SECTIONS.SPECIAL_OFFERS) == -1;

	if (insert_slider_section) {
		tableData.push({
			section: HOME_PAGE_SECTIONS.SLIDER_SECTION,
			value: slider_section,
			last_updated_by: adminUserId || "",
		});
	}
	if (insert_banner_section) {
		tableData.push({
			section: HOME_PAGE_SECTIONS.BANNER_SECTION,
			value: banner_section,
			last_updated_by: adminUserId || "",
		});
	}
	if (insert_about_us_section) {
		tableData.push({
			section: HOME_PAGE_SECTIONS.ABOUT_US_SECTION,
			value: about_us_section,
			last_updated_by: adminUserId || "",
		});
	}
	if (insert_our_category_section) {
		tableData.push({
			section: HOME_PAGE_SECTIONS.OUR_CATEGORY_SECTION,
			value: our_category_section,
			last_updated_by: adminUserId || "",
		});
	}
	if (insert_bottom_section) {
		tableData.push({
			section: HOME_PAGE_SECTIONS.BOTTOM_SECTION,
			value: bottom_section,
			last_updated_by: adminUserId || "",
		});
	}
	if (insert_special_offers) {
		tableData.push({
			section: HOME_PAGE_SECTIONS.SPECIAL_OFFERS,
			value: special_offers,
			last_updated_by: adminUserId || "",
		});
	}

	if (tableData.length > 0) {
		await HomePageSetup.bulkCreate(tableData, { transaction });
	}

	logger.info(`Home Page Setup seeder ran successfully. Total ${tableData.length} sections seeded`);

	return;
};

export default homePageSetupSeed;
