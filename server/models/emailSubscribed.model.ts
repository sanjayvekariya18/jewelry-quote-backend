import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface EmailSubscribedAttributes {
	id: string;
	email: string;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface EmailSubscribedInput extends Optional<EmailSubscribedAttributes, "id" | "is_deleted" | "last_updated_by"> {}
export interface EmailSubscribedOutput extends Required<EmailSubscribedAttributes> {}

class EmailSubscribed extends Model<EmailSubscribedAttributes, EmailSubscribedInput> implements EmailSubscribedAttributes {
	public id!: string;
	public email!: string;
	public is_deleted!: boolean;
	public last_updated_by!: string;
}

EmailSubscribed.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		last_updated_by: {
			type: DataTypes.UUID,
			allowNull: true,
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
		tableName: `email_subscribed`,
	}
);

export default EmailSubscribed;
