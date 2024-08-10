import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";
import CustomerDetails from "./customerDetails.model";

export interface EnquiryNowAttribute {
	id: string;
	customer_id: string;
	product_ids: string;
	email: string;
	contact_number: string;
	notes: string;
	is_read: boolean;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface EnquiryNowInput extends Optional<EnquiryNowAttribute, "id" | "is_read" | "is_deleted" | "last_updated_by"> {}
export interface EnquiryNowOutput extends Required<EnquiryNowAttribute> {}

class EnquiryNow extends Model<EnquiryNowAttribute, EnquiryNowInput> implements EnquiryNowAttribute {
	public id!: string;
	public customer_id!: string;
	public product_ids!: string;
	public email!: string;
	public contact_number!: string;
	public notes!: string;
	public is_read!: boolean;
	public is_deleted!: boolean;
	public last_updated_by!: string;

	public createdAt!: Date;

	public CustomerDetail!: CustomerDetails;
}

EnquiryNow.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		customer_id: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: {
					tableName: "customer_details",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		product_ids: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		contact_number: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		is_read: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		last_updated_by: {
			type: DataTypes.UUID,
			allowNull: true,
			defaultValue: null,
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
		tableName: `enquiry_now`,
	}
);

export default EnquiryNow;
