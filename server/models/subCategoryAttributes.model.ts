import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface SubCategoryAttributesAttribute {
	id: string;
	sub_category_id: string;
	attribute_id: string;
	last_updated_by: string;
}

export interface SubCategoryAttributesInput extends Optional<SubCategoryAttributesAttribute, "id"> {}
export interface SubCategoryAttributesOutput extends Required<SubCategoryAttributesAttribute> {}

class SubCategoryAttributes extends Model<SubCategoryAttributesAttribute, SubCategoryAttributesInput> implements SubCategoryAttributesAttribute {
	public id!: string;
	public sub_category_id!: string;
	public attribute_id!: string;
	public last_updated_by!: string;
}

SubCategoryAttributes.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		sub_category_id: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: {
					tableName: "sub_category",
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
		tableName: `sub_category_attributes`,
	}
);

export default SubCategoryAttributes;
