import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface WishListAttribute {
	id: string;
	customer_id: string;
	product_id: string;
}

export interface WishListInput extends Optional<WishListAttribute, "id"> {}
export interface WishListOutput extends Required<WishListAttribute> {}

class WishList extends Model<WishListAttribute, WishListInput> implements WishListAttribute {
	id!: string;
	customer_id!: string;
	product_id!: string;
}

WishList.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		customer_id: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: {
					tableName: "customer_details",
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
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: true,
		tableName: `wishlist`,
	}
);
export default WishList;
