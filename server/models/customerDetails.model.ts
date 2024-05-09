import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface SocialMedia {
	linked_in: string;
	facebook: string;
	instagram: string;
}

export interface CustomerDetailsAttributes {
	id: string;
	customer_name: string;
	customer_email: string;
	login_id: string | null;
	country_code: string;
	mobile_number: string;
	password: string | null;
	whatsapp_number: string | null;
	customer_address: string | null;
	website: string | null;
	business_registration: string | null;
	customer_fax: string | null;
	customer_business_card: string | null;
	association_membership: string | null;
	customer_social_media: SocialMedia;
	business_reference: string | null;
	is_active: boolean;
	is_deleted: boolean;
}

export interface CustomerDetailsInput
	extends Optional<
		CustomerDetailsAttributes,
		| "id"
		| "whatsapp_number"
		| "login_id"
		| "password"
		| "customer_address"
		| "website"
		| "business_registration"
		| "customer_fax"
		| "customer_business_card"
		| "association_membership"
		| "customer_social_media"
		| "business_reference"
		| "is_active"
		| "is_deleted"
	> {}
export interface CustomerDetailsOutput extends Required<CustomerDetailsAttributes> {}

class CustomerDetails extends Model<CustomerDetailsAttributes, CustomerDetailsInput> implements CustomerDetailsAttributes {
	public id!: string;
	public customer_name!: string;
	public customer_email!: string;
	public login_id!: string | null;
	public country_code!: string;
	public mobile_number!: string;
	public password!: string | null;
	public whatsapp_number!: string | null;
	public customer_address!: string | null;
	public website!: string | null;
	public business_registration!: string | null;
	public customer_fax!: string | null;
	public customer_business_card!: string | null;
	public association_membership!: string | null;
	public customer_social_media!: SocialMedia;
	public business_reference!: string | null;
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
		customer_fax: {
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
		customer_social_media: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		business_reference: {
			type: DataTypes.STRING,
			defaultValue: null,
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
