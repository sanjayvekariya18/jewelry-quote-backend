import { Transaction } from "sequelize";
import { Category } from "../../models";
import { SubCategory, SubcategoryAttribute } from "../../models";
import { logger } from "../../config";
import jsonData from "./subcategory.json";

const subcategorySeed = async (transaction: Transaction, adminUserId: string | undefined) => {
	// const jsonData: Array<any> = JSON.parse(fs.readFileSync(`${__dirname}/subcategory.json`, "utf-8"));
	const categoryData = await Category.findAll({ where: { is_deleted: false }, raw: true, transaction });
	let tableData: Array<SubcategoryAttribute> = jsonData.map((data) => {
		const category = categoryData.find((row) => row.name == data.category);
		return {
			name: data.name,
			category_id: category?.id || "",
			last_updated_by: adminUserId,
		} as SubcategoryAttribute;
	});
	const subcategoryData = (await SubCategory.findAll({ where: { is_deleted: false }, attributes: ["name"], raw: true, transaction })).map(
		(data) => data.name
	);
	tableData = tableData.filter((data) => subcategoryData.indexOf(data.name || "") < 0);

	return await SubCategory.bulkCreate(tableData, { ignoreDuplicates: true, transaction, returning: true }).then((data) => {
		logger.info(`Subcategory seeder ran successfully. Total ${data.length} subcategories seeded`);
		return data;
	});
};

export default subcategorySeed;
