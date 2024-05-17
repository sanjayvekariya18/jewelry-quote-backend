import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface QuotationProductAttribute {
	id: string;
	quotation_id: string;
	product_id: string;
	qty: number;
	price: number | null;
	notes: string;
}

export interface QuotationProductInput extends Optional<QuotationProductAttribute, "id" | "price"> {}
export interface QuotationProductOutput extends Required<QuotationProductAttribute> {}

class QuotationProduct extends Model<QuotationProductAttribute, QuotationProductInput> implements QuotationProductAttribute {
	public id!: string;
	public quotation_id!: string;
	public product_id!: string;
	public qty!: number;
	public price!: number | null;
	public notes!: string;
}

QuotationProduct.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		quotation_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: {
					tableName: "quotation_master",
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
		qty: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		price: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: true,
			defaultValue: null,
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: "",
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: true,
		tableName: `quotation_products`,
	}
);

export default QuotationProduct;
