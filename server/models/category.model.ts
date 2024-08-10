import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface CategoryAttribute {
	id: string;
	name: string;
	details: string;
	img_url: string;
	logo_url: string;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface CategoryInput extends Optional<CategoryAttribute, "id" | "details" | "img_url" | "logo_url" | "is_deleted" | "last_updated_by"> {}
export interface CategoryOutput extends Required<CategoryAttribute> {}

class Category extends Model<CategoryAttribute, CategoryInput> implements CategoryAttribute {
	public id!: string;
	public name!: string;
	public details!: string;
	public img_url!: string;
	public logo_url!: string;
	public is_deleted!: boolean;
	public last_updated_by!: string;
}

Category.init(
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
		tableName: `category`,
	}
);

export default Category;
