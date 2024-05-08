import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { OTHER_DETAIL_TYPES } from "../enum";

export interface QuotationOtherDetailAttribute {
	id: string;
	quotation_product_id: string;
	detail_name: string;
	detail_value: string;
}

export interface QuotationOtherDetailInput extends Optional<QuotationOtherDetailAttribute, "id"> {}
export interface QuotationOtherDetailOutput extends Required<QuotationOtherDetailAttribute> {}

class QuotationOtherDetail extends Model<QuotationOtherDetailAttribute, QuotationOtherDetailInput> implements QuotationOtherDetailAttribute {
	public id!: string;
	public quotation_product_id!: string;
	public detail_name!: string;
	public detail_value!: OTHER_DETAIL_TYPES;
}

QuotationOtherDetail.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		quotation_product_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: {
					tableName: "quotation_products",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		detail_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		detail_value: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: true,
		tableName: `quotation_other_detail`,
	}
);

export default QuotationOtherDetail;
