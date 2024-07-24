import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { FORGOT_PASSWORD_USER_TYPE } from "../enum";

export interface ForgotPasswordAttribute {
	id: string;
	email: string;
	expiry: Date;
	securityCode: string;
	user_type: FORGOT_PASSWORD_USER_TYPE;
}

export interface ForgotPasswordInput extends Optional<ForgotPasswordAttribute, "id"> {}
export interface ForgotPasswordOutput extends Required<ForgotPasswordAttribute> {}

class ForgotPassword extends Model<ForgotPasswordAttribute, ForgotPasswordInput> implements ForgotPasswordAttribute {
	public id!: string;
	public email!: string;
	public expiry!: Date;
	public securityCode!: string;
	public user_type!: FORGOT_PASSWORD_USER_TYPE;
}

ForgotPassword.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		email: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		expiry: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		securityCode: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		user_type: {
			type: DataTypes.ENUM(...Object.values(FORGOT_PASSWORD_USER_TYPE)),
			allowNull: false,
		},
	},
	{
		sequelize: sequelizeConnection,
		paranoid: false,
		freezeTableName: true,
		timestamps: false,
		tableName: `forgot_password`,
	}
);

export default ForgotPassword;
