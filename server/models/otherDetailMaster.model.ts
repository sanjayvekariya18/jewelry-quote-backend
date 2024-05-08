import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { OTHER_DETAIL_TYPES } from "../enum";

export interface OtherDetailMasterAttribute {
	id: string;
	detail_name: string;
	detail_type: OTHER_DETAIL_TYPES;
	last_updated_by: string;
}

export interface OtherDetailMasterInput extends Optional<OtherDetailMasterAttribute, "id" | "last_updated_by"> {}
export interface OtherDetailMasterOutput extends Required<OtherDetailMasterAttribute> {}

class OtherDetailMaster extends Model<OtherDetailMasterAttribute, OtherDetailMasterInput> implements OtherDetailMasterAttribute {
	public id!: string;
	public detail_name!: string;
	public detail_type!: OTHER_DETAIL_TYPES;
	public last_updated_by!: string;
}

OtherDetailMaster.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		detail_name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		detail_type: {
			type: DataTypes.ENUM(...Object.values(OTHER_DETAIL_TYPES)),
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
		tableName: `other_detail_master`,
	}
);

export default OtherDetailMaster;
