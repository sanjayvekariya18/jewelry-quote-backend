import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface AttributesOptionsAttribute {
	id: string;
	attribute_id: string;
	option_id: string;
	last_updated_by: string;
}

export interface AttributesOptionsInput extends Optional<AttributesOptionsAttribute, "id"> {}
export interface AttributesOptionsOutput extends Required<AttributesOptionsAttribute> {}

class AttributesOptions extends Model<AttributesOptionsAttribute, AttributesOptionsInput> implements AttributesOptionsAttribute {
	public id!: string;
	public attribute_id!: string;
	public option_id!: string;
	public last_updated_by!: string;
}

AttributesOptions.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
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
		tableName: `attribute_options`,
	}
);

export default AttributesOptions;
