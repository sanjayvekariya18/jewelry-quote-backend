import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface OptionsAttributes {
	id: string;
	name: string;
	details: string;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface OptionsInput extends Optional<OptionsAttributes, "id" | "details" | "is_deleted"> {}
export interface OptionsOutput extends Required<OptionsAttributes> {}

class Options extends Model<OptionsAttributes, OptionsInput> implements OptionsAttributes {
	public id!: string;
	public name!: string;
	public details!: string;
	public is_deleted!: boolean;
	public last_updated_by!: string;
}

Options.init(
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
			type: DataTypes.STRING,
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
		tableName: `options`,
	}
);

export default Options;
