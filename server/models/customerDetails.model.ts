import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { DESCRIPTION_OF_BUSINESS } from "../enum";

export interface SocialMedia {
	linked_in: string;
	facebook: string;
	instagram: string;
}

export interface CustomerDetailsAttributes {
	id: string;
	company_name: string;
	customer_name: string;
	customer_email: string;
	login_id: string | null;
	country_code: string;
	mobile_number: string;
	password: string | null;
	wp_country_code: string | null;
	whatsapp_number: string | null;
	customer_address: string | null;
	address_map_link: string;
	city: string;
	country: string;
	zip_code: string;
	website: string | null;
	business_registration: string | null;
	company_tax_number: string | null;
	customer_business_card: string | null;
	association_membership: string | null;
	description_of_business: DESCRIPTION_OF_BUSINESS;
	customer_social_media: SocialMedia;
	is_active: boolean;
	is_deleted: boolean;
}

export interface CustomerDetailsInput
	extends Optional<
		CustomerDetailsAttributes,
		| "id"
		| "wp_country_code"
		| "whatsapp_number"
		| "login_id"
		| "password"
		| "customer_address"
		| "website"
		| "business_registration"
		| "customer_business_card"
		| "association_membership"
		| "customer_social_media"
		| "is_active"
		| "is_deleted"
	> {}
export interface CustomerDetailsOutput extends Required<CustomerDetailsAttributes> {}

class CustomerDetails extends Model<CustomerDetailsAttributes, CustomerDetailsInput> implements CustomerDetailsAttributes {
	public id!: string;
	public company_name!: string;
	public customer_name!: string;
	public customer_email!: string;
	public login_id!: string | null;
	public country_code!: string;
	public mobile_number!: string;
	public password!: string | null;
	public wp_country_code!: string | null;
	public whatsapp_number!: string | null;
	public customer_address!: string | null;
	public address_map_link!: string;
	public city!: string;
	public country!: string;
	public zip_code!: string;
	public website!: string | null;
	public business_registration!: string | null;
	public company_tax_number!: string | null;
	public customer_business_card!: string | null;
	public association_membership!: string | null;
	public description_of_business!: DESCRIPTION_OF_BUSINESS;
	public customer_social_media!: SocialMedia;
	public is_active!: boolean;
	public is_deleted!: boolean;
}

CustomerDetails.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		company_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		customer_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		customer_email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		login_id: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
		},
		country_code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mobile_number: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
		},
		wp_country_code: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true,
		},
		whatsapp_number: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true,
		},
		customer_address: {
			type: DataTypes.TEXT,
			defaultValue: null,
			allowNull: true,
		},
		address_map_link: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		zip_code: {
			type: DataTypes.STRING(10),
			allowNull: false,
		},
		website: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true,
		},
		business_registration: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true,
		},
		company_tax_number: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true,
		},
		customer_business_card: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true,
		},
		association_membership: {
			type: DataTypes.STRING,
			defaultValue: null,
			allowNull: true,
		},
		description_of_business: {
			type: DataTypes.ENUM(...Object.values(DESCRIPTION_OF_BUSINESS)),
			allowNull: false,
		},
		customer_social_media: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: true,
		tableName: `customer_details`,
	}
);

export default CustomerDetails;
