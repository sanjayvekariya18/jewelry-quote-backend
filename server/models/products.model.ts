import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface ProductsAttributes {
	id: string;
	stock_id: string;
	sub_category_id: string;
	name: string;
	description: string;
	is_active: boolean;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface ProductsInput extends Optional<ProductsAttributes, "id" | "description" | "is_active" | "is_deleted" | "last_updated_by"> {}
export interface ProductsOutput extends Required<ProductsAttributes> {}

class Products extends Model<ProductsAttributes, ProductsInput> implements ProductsAttributes {
	public id!: string;
	public stock_id!: string;
	public sub_category_id!: string;
	public name!: string;
	public description!: string;
	public is_active!: boolean;
	public is_deleted!: boolean;
	public last_updated_by!: string;
}

Products.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		stock_id: {
			type: DataTypes.STRING,
			allowNull: false,
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
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
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
		tableName: `products`,
	}
);

export default Products;