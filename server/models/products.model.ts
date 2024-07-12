import { DataTypes, Model, Optional } from "sequelize";
import { sequelizeConnection } from "../config/database";

export interface ProductsAttributes {
	id: string;
	stock_id: string;
	position: number;
	sub_category_id: string;
	name: string;
	description: string;
	metal_type: string;
	style: string;
	setting_type: string;
	sub_setting: string;
	prong_type: string;
	shank_type: string;
	band_type: string;
	fit_type: string;
	lock_type: string;
	bail_type: string;
	is_active: boolean;
	is_deleted: boolean;
	last_updated_by: string;
}

export interface ProductsInput
	extends Optional<
		ProductsAttributes,
		| "id"
		| "position"
		| "description"
		| "metal_type"
		| "style"
		| "setting_type"
		| "sub_setting"
		| "prong_type"
		| "shank_type"
		| "band_type"
		| "fit_type"
		| "lock_type"
		| "bail_type"
		| "is_active"
		| "is_deleted"
		| "last_updated_by"
	> {}
export interface ProductsOutput extends Required<ProductsAttributes> {}

class Products extends Model<ProductsAttributes, ProductsInput> implements ProductsAttributes {
	public id!: string;
	public stock_id!: string;
	public position!: number;
	public sub_category_id!: string;
	public name!: string;
	public description!: string;
	public metal_type!: string;
	public style!: string;
	public setting_type!: string;
	public sub_setting!: string;
	public prong_type!: string;
	public shank_type!: string;
	public band_type!: string;
	public fit_type!: string;
	public lock_type!: string;
	public bail_type!: string;
	public is_active!: boolean;
	public is_deleted!: boolean;
	public last_updated_by!: string;
}

Products.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
		},
		stock_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		position: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		sub_category_id: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: {
					tableName: "sub_category",
				},
				key: "id",
			},
			onUpdate: "RESTRICT",
			onDelete: "CASCADE",
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: null,
		},
		metal_type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		style: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		setting_type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		sub_setting: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		prong_type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		shank_type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		band_type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		fit_type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		lock_type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
		},
		bail_type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "",
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
		tableName: `products`,
	}
);

export default Products;
