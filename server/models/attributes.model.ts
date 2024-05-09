import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface AttributesAttributes {
	id: string;
	name: string;
	details: string;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface AttributesInput extends Optional<AttributesAttributes, "id" | "details" | "is_deleted"> {}
export interface AttributesOutput extends Required<AttributesAttributes> {}

class Attributes extends Model<AttributesAttributes, AttributesInput> implements AttributesAttributes {
	public id!: string;
	public name!: string;
	public details!: string;
	public is_deleted!: boolean;
	public last_updated_by!: string;
}

Attributes.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		details: {
			type: DataTypes.TEXT,
			defaultValue: "",
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
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
		tableName: `attributes`,
	}
);

export default Attributes;
