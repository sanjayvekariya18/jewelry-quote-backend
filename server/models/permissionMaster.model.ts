import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface PermissionMasterAttributes {
	id: string;
	permissionName: string;
	permissionGroup: string;
}

export interface PermissionMasterInput extends Optional<PermissionMasterAttributes, "id"> {}
export interface PermissionMasterOutput extends Required<PermissionMasterAttributes> {}

class PermissionMaster extends Model<PermissionMasterAttributes, PermissionMasterInput> implements PermissionMasterAttributes {
	public id!: string;
	public permissionName!: string;
	public permissionGroup!: string;
}

PermissionMaster.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		permissionName: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		permissionGroup: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: true,
		tableName: `permission_master`,
	}
);

export default PermissionMaster;
