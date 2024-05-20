import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { USER_TYPES } from "../enum";

export interface UserMasterAttributes {
	id: string;
	name: string;
	email: string;
	mobile_number: string | null;
	password: string;
	user_type: USER_TYPES;
	is_active: boolean;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface UserMasterInput
	extends Optional<UserMasterAttributes, "id" | "mobile_number" | "is_active" | "user_type" | "is_deleted" | "last_updated_by"> {}
export interface UserMasterOutput extends Required<UserMasterAttributes> {}

class UserMaster extends Model<UserMasterAttributes, UserMasterInput> implements UserMasterAttributes {
	public id!: string;
	public name!: string;
	public email!: string;
	public mobile_number!: string;
	public password!: string;
	public user_type!: USER_TYPES;
	public is_active!: boolean;
	public is_deleted!: boolean;
	public last_updated_by!: string;
}

UserMaster.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mobile_number: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user_type: {
			type: DataTypes.ENUM(...Object.values(USER_TYPES)),
			allowNull: false,
			defaultValue: USER_TYPES.USER,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
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
		tableName: `user_master`,
	}
);

export default UserMaster;
