import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface PermissionMasterAttributes {
	id: string;
	permissionName: string;
	permissionGroup: string;
	last_updated_by: string;
}

export interface PermissionMasterInput extends Optional<PermissionMasterAttributes, "id" | "last_updated_by"> {}
export interface PermissionMasterOutput extends Required<PermissionMasterAttributes> {}

class PermissionMaster extends Model<PermissionMasterAttributes, PermissionMasterInput> implements PermissionMasterAttributes {
	public id!: string;
	public permissionName!: string;
	public permissionGroup!: string;
	public last_updated_by!: string;
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
		last_updated_by: {
			type: DataTypes.UUID,
			allowNull: false,
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
		tableName: `permission_master`,
	}
);

export default PermissionMaster;
