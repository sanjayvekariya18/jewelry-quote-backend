import fs from "fs";
import { Transaction } from "sequelize";
import logger from "../../config/logger";
import Category, { CategoryAttribute } from "../../models/category.model";
import jsonData from "./category.json";

const categorySeed = async (transaction: Transaction, adminUserId: string | undefined) => {
	// const jsonData: Array<any> = JSON.parse(fs.readFileSync(`${__dirname}/category.json`, "utf-8"));
	let tableData: Array<CategoryAttribute> = jsonData.map((data) => {
		return {
			name: data.name,
			last_updated_by: adminUserId,
		} as CategoryAttribute;
	});

	const categoryData = (await Category.findAll({ where: { is_deleted: false }, raw: true, transaction })).map((data) => data.name);
	tableData = tableData.filter((data) => categoryData.indexOf(data.name || "") < 0);

	return await Category.bulkCreate(tableData, { ignoreDuplicates: true, transaction, returning: true }).then((data) => {
		logger.info(`Category seeder ran successfully. Total ${data.length} categories seeded`);
		return data;
	});
};

export default categorySeed;
