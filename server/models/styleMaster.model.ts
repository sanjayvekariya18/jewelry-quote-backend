import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface StyleMasterAttributes {
	id: string;
	parent_id: string | null;
	sub_category_id: string;
	name: string;
	last_updated_by: string;
}

export interface StyleMasterInput extends Optional<StyleMasterAttributes, "parent_id" | "last_updated_by"> {}
export interface StyleMasterOutput extends Required<StyleMasterAttributes> {}

class StyleMaster extends Model<StyleMasterAttributes, StyleMasterInput> implements StyleMasterAttributes {
	public id!: string;
	public parent_id!: string;
	public sub_category_id!: string;
	public name!: string;
	public last_updated_by!: string;
}

StyleMaster.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		parent_id: {
			type: DataTypes.UUID,
			defaultValue: null,
			references: {
				model: {
					tableName: "style_master",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		sub_category_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: {
					tableName: "sub_category",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
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
		tableName: `style_master`,
	}
);

export default StyleMaster;
