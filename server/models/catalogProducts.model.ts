import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface CatalogProductsAttribute {
	id: string;
	catalog_id: string;
	product_id: string;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface CatalogProductsInput extends Optional<CatalogProductsAttribute, "id" | "is_deleted" | "last_updated_by"> {}
export interface CatalogProductsOutput extends Required<CatalogProductsAttribute> {}

class CatalogProducts extends Model<CatalogProductsAttribute, CatalogProductsInput> implements CatalogProductsAttribute {
	public id!: string;
	public catalog_id!: string;
	public product_id!: string;
	public is_deleted!: boolean;
	public last_updated_by!: string;
}

CatalogProducts.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		catalog_id: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: {
					tableName: "catalog_master",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		product_id: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: {
					tableName: "products",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
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
		tableName: `catalog_products`,
	}
);

export default CatalogProducts;
