import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface CatalogMasterAttribute {
	id: string;
	name: string;
	description: String;
	img_url: string;
	pdf_url: string;
	is_active: boolean;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface CatalogMasterInput
	extends Optional<CatalogMasterAttribute, "id" | "description" | "img_url" | "pdf_url" | "is_active" | "is_deleted" | "last_updated_by"> {}
export interface CatalogMasterOutput extends Required<CatalogMasterAttribute> {}

class CatalogMaster extends Model<CatalogMasterAttribute, CatalogMasterInput> implements CatalogMasterAttribute {
	public id!: string;
	public name!: string;
	public description!: String;
	public img_url!: string;
	public pdf_url!: string;
	public is_active!: boolean;
	public is_deleted!: boolean;
	public last_updated_by!: string;
}

CatalogMaster.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		description: {
			defaultValue: "",
			type: DataTypes.STRING,
		},
		img_url: {
			defaultValue: null,
			type: DataTypes.STRING,
		},
		pdf_url: {
			defaultValue: null,
			type: DataTypes.STRING,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		is_deleted: {
			defaultValue: false,
			type: DataTypes.BOOLEAN,
		},
		last_updated_by: {
			allowNull: false,
			type: DataTypes.UUID,
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
		tableName: `catalog_master`,
	}
);

export default CatalogMaster;
