import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface SliderSection {
	id: string;
	title: string;
	description: string;
	button_text: string;
	button_link: string;
	image_src: string;
	file_name?: string;
}

export interface BannerData {
	id: string;
	title: string;
	banner_link: string;
	image_src: string;
	file_name?: string;
}

export interface SpecialOffersData {
	id: string;
	title: string;
	sub_title: string;
	image_src: string;
	file_name?: string;
}

export interface AboutUsSection {
	title: string;
	content: string;
	image_src: string;
}

export interface BottomSection {
	text_content: string;
	our_expertise_img: string;
	our_vision_content: string;
	our_mission_content: string;
}

export interface HomePageSetupAttributes {
	id: string;
	section: string;
	value: Array<SliderSection> | Array<BannerData> | Array<SpecialOffersData> | AboutUsSection | Array<BannerData> | BottomSection;
	last_updated_by: string;
}

export interface HomePageSetupInput extends Optional<HomePageSetupAttributes, "id"> {}
export interface HomePageSetupOutput extends Required<HomePageSetupAttributes> {}

class HomePageSetup extends Model<HomePageSetupAttributes, HomePageSetupInput> implements HomePageSetupAttributes {
	public id!: string;
	public section!: string;
	public value!: Array<SliderSection> | Array<BannerData> | Array<SpecialOffersData> | AboutUsSection | Array<BannerData> | BottomSection;
	public last_updated_by!: string;
}

HomePageSetup.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		section: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		value: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		last_updated_by: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: {
					tableName: "user_master",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: true,
		tableName: `home_page_setup`,
	}
);

export default HomePageSetup;
