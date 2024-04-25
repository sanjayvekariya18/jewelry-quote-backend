import { QueryTypes } from "sequelize";
import { sequelizeConnection } from "../config/database";
import { Attributes, Category, CustomerDetails, Options, SubCategory, UserMaster } from "../models";

export default class ListService {
	private Sequelize = sequelizeConnection.Sequelize;

	public category = async () => {
		return await Category.findAll({
			where: { is_deleted: false },
			attributes: [
				[this.Sequelize.col("id"), "value"],
				[this.Sequelize.col("name"), "label"],
			],
			order: [["name", "ASC"]],
		});
	};

	public subCategory = async () => {
		return await SubCategory.findAll({
			where: { is_deleted: false },
			attributes: [
				[this.Sequelize.col("id"), "value"],
				[this.Sequelize.col("name"), "label"],
			],
			order: [["name", "ASC"]],
		});
	};

	public users = async () => {
		return await UserMaster.findAll({
			where: { is_deleted: false },
			attributes: [
				[this.Sequelize.col("id"), "value"],
				[this.Sequelize.col("name"), "label"],
			],
			order: [["name", "ASC"]],
		});
	};

	public customers = async () => {
		return await CustomerDetails.findAll({
			where: { is_deleted: false, is_active: true },
			attributes: [
				[this.Sequelize.col("id"), "value"],
				[this.Sequelize.col("customer_name"), "label"],
			],
			order: [["customer_name", "ASC"]],
		});
	};

	public attributes = async () => {
		return await Attributes.findAll({
			where: { is_deleted: false },
			attributes: [
				[this.Sequelize.col("id"), "value"],
				[this.Sequelize.col("name"), "label"],
			],
			order: [["name", "ASC"]],
		});
	};

	public options = async () => {
		return await Options.findAll({
			where: { is_deleted: false },
			attributes: [
				[this.Sequelize.col("id"), "value"],
				[this.Sequelize.col("name"), "label"],
			],
			order: [["name", "ASC"]],
		});
	};
}
