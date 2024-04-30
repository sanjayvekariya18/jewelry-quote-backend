import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface ATQAttributeOptionsAttribute {
	id: string;
	add_to_quote_id: string;
	attribute_id: string;
	option_id: string;
}

export interface ATQAttributeOptionsInput extends Optional<ATQAttributeOptionsAttribute, "id"> {}
export interface ATQAttributeOptionsOutput extends Required<ATQAttributeOptionsAttribute> {}

class ATQAttributeOptions extends Model<ATQAttributeOptionsAttribute, ATQAttributeOptionsInput> implements ATQAttributeOptionsAttribute {
	public id!: string;
	public add_to_quote_id!: string;
	public attribute_id!: string;
	public option_id!: string;
}

ATQAttributeOptions.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		add_to_quote_id: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: {
					tableName: "add_to_quote",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		attribute_id: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: {
					tableName: "attributes",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		option_id: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: {
					tableName: "options",
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
		tableName: `atq_attribute_options`,
	}
);

export default ATQAttributeOptions;
