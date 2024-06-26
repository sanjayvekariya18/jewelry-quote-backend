import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { QUOTATION_STATUS } from "../enum";

export interface QuotationMasterAttribute {
	id: string;
	customer_id: string;
	quotation_date: Date;
	status: QUOTATION_STATUS;
}

export interface QuotationMasterInput extends Optional<QuotationMasterAttribute, "id" | "status"> {}
export interface QuotationMasterOutput extends Required<QuotationMasterAttribute> {}

class QuotationMaster extends Model<QuotationMasterAttribute, QuotationMasterInput> implements QuotationMasterAttribute {
	public id!: string;
	public customer_id!: string;
	public quotation_date!: Date;
	public status!: QUOTATION_STATUS;
}

QuotationMaster.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
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
		quotation_date: {
			allowNull: false,
			type: DataTypes.DATE,
		},
		status: {
			type: DataTypes.ENUM(...Object.values(QUOTATION_STATUS)),
			allowNull: false,
			defaultValue: QUOTATION_STATUS.PENDING,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: true,
		tableName: `quotation_master`,
	}
);

export default QuotationMaster;
