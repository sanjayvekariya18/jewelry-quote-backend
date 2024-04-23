import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface UserPermissionsAttributes {
	id: string;
	user_id: string;
	permission_master_id: string;
	view: boolean;
	create: boolean;
	edit: boolean;
	delete: boolean;
	last_updated_by: string;
}

export interface UserPermissionsInput extends Optional<UserPermissionsAttributes, "id" | "last_updated_by"> {}
export interface UserPermissionsOutput extends Required<UserPermissionsAttributes> {}

class UserPermissions extends Model<UserPermissionsAttributes, UserPermissionsInput> {
	public id!: string;
	public user_id!: string;
	public permission_master_id!: string;
	public view!: boolean;
	public create!: boolean;
	public edit!: boolean;
	public delete!: boolean;
	public last_updated_by!: string;
}

UserPermissions.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		user_id: {
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
		permission_master_id: {
			allowNull: false,
			type: DataTypes.UUID,
			references: {
				model: {
					tableName: "permission_master",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		view: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		create: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		edit: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		delete: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
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
		tableName: `user_permissions`,
	}
);

export default UserPermissions;
