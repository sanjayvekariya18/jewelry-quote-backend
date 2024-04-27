import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface ProductAttributeOptionsAttribute {
	id: string;
	product_id: string;
	attribute_id: string;
	default_option: string;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface ProductAttributeOptionsInput extends Optional<ProductAttributeOptionsAttribute, "id" | "is_deleted"> {}
export interface ProductAttributeOptionsOutput extends Required<ProductAttributeOptionsAttribute> {}

class ProductAttributeOptions
	extends Model<ProductAttributeOptionsAttribute, ProductAttributeOptionsInput>
	implements ProductAttributeOptionsAttribute
{
	public id!: string;
	public product_id!: string;
	public attribute_id!: string;
	public default_option!: string;
	public is_deleted!: boolean;
	public last_updated_by!: string;
}

ProductAttributeOptions.init(
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
		default_option: {
			allowNull: false,
			type: DataTypes.STRING,
			// references: {
			// 	model: {
			// 		tableName: "options",
			// 	},
			// 	key: "id",
			// },
			// onUpdate: "RESTRICT",
			// onDelete: "CASCADE",
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
		// indexes: [
		// 	{
		// 		unique: false, // Set to true if you want the index to be unique
		// 		fields: ["attribute_id", "option_id"],
		// 		name: "idx_productAttributes_attributeId_optionId",
		// 	},
		// ],
		tableName: `product_attribute_options`,
	}
);

export default ProductAttributeOptions;
