import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface SubcategoryAttribute {
	id: string;
	category_id: string;
	name: string;
	details: String;
	img_url: string;
	logo_url: string;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface SubcategoryInput
	extends Optional<SubcategoryAttribute, "id" | "details" | "img_url" | "logo_url" | "is_deleted" | "last_updated_by"> {}
export interface SubcategoryOutput extends Required<SubcategoryAttribute> {}

class SubCategory extends Model<SubcategoryAttribute, SubcategoryInput> implements SubcategoryAttribute {
	public id!: string;
	public category_id!: string;
	public name!: string;
	public details!: String;
	public img_url!: string;
	public logo_url!: string;
	public is_deleted!: boolean;
	public last_updated_by!: string;
}

SubCategory.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		category_id: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: {
					tableName: "category",
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
		details: {
			defaultValue: "",
			type: DataTypes.STRING,
		},
		img_url: {
			defaultValue: null,
			type: DataTypes.STRING,
		},
		logo_url: {
			defaultValue: null,
			type: DataTypes.STRING,
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
		tableName: `sub_category`,
	}
);

export default SubCategory;
