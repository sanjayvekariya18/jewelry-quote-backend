import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface QuotationAttributeOptionsAttribute {
	id: string;
	quotation_product_id: string;
	attribute_name: string;
	option_name: string;
}

export interface QuotationAttributeOptionsInput extends Optional<QuotationAttributeOptionsAttribute, "id"> {}
export interface QuotationAttributeOptionsOutput extends Required<QuotationAttributeOptionsAttribute> {}

class QuotationAttributeOptions
	extends Model<QuotationAttributeOptionsAttribute, QuotationAttributeOptionsInput>
	implements QuotationAttributeOptionsAttribute
{
	public id!: string;
	public quotation_product_id!: string;
	public attribute_name!: string;
	public option_name!: string;
}

QuotationAttributeOptions.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		quotation_product_id: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: {
					tableName: "quotation_products",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		attribute_name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		option_name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: true,
		tableName: `quotation_attribute_options`,
	}
);

export default QuotationAttributeOptions;
