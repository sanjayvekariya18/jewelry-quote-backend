import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { OTHER_DETAIL_TYPES } from "../enum";

export interface ProductOtherDetailAttribute {
	id: string;
	product_id: string;
	other_detail_id: string;
	detail_value: string;
	last_updated_by: string;
}

export interface ProductOtherDetailInput extends Optional<ProductOtherDetailAttribute, "id" | "last_updated_by"> {}
export interface ProductOtherDetailOutput extends Required<ProductOtherDetailAttribute> {}

class ProductOtherDetail extends Model<ProductOtherDetailAttribute, ProductOtherDetailInput> implements ProductOtherDetailAttribute {
	public id!: string;
	public product_id!: string;
	public other_detail_id!: string;
	public detail_value!: OTHER_DETAIL_TYPES;
	public last_updated_by!: string;
}

ProductOtherDetail.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		product_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: {
					tableName: "products",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		other_detail_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: {
					tableName: "other_detail_master",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		detail_value: {
			type: DataTypes.STRING,
			allowNull: false,
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
		tableName: `product_other_detail`,
	}
);

export default ProductOtherDetail;
