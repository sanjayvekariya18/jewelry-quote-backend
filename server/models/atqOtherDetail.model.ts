import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { OTHER_DETAIL_TYPES } from "../enum";

export interface ATQOtherDetailAttribute {
	id: string;
	add_to_quote_id: string;
	detail_name: string;
	detail_value: string;
}

export interface ATQOtherDetailInput extends Optional<ATQOtherDetailAttribute, "id"> {}
export interface ATQOtherDetailOutput extends Required<ATQOtherDetailAttribute> {}

class ATQOtherDetail extends Model<ATQOtherDetailAttribute, ATQOtherDetailInput> implements ATQOtherDetailAttribute {
	public id!: string;
	public add_to_quote_id!: string;
	public detail_name!: string;
	public detail_value!: OTHER_DETAIL_TYPES;
}

ATQOtherDetail.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		add_to_quote_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: {
					tableName: "add_to_quote",
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
		tableName: `atq_other_detail`,
	}
);

export default ATQOtherDetail;
