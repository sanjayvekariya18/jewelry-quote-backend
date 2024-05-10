import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface AddToQuoteAttribute {
	id: string;
	product_id: string;
	customer_id: string;
	qty: number;
	notes: string;
}

export interface AddToQuoteInput extends Optional<AddToQuoteAttribute, "id" | "notes"> {}
export interface AddToQuoteOutput extends Required<AddToQuoteAttribute> {}

class AddToQuote extends Model<AddToQuoteAttribute, AddToQuoteInput> implements AddToQuoteAttribute {
	public id!: string;
	public product_id!: string;
	public customer_id!: string;
	public qty!: number;
	public notes!: string;
}

AddToQuote.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
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
		customer_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: {
					tableName: "customer_details",
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
		tableName: `add_to_quote`,
	}
);

export default AddToQuote;
