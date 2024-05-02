import fs from "fs";
import { Transaction } from "sequelize";
import { Attributes, SubCategory, SubCategoryAttributes, SubCategoryAttributesInput } from "../../models";
import { logger } from "../../config";

const subCategoryAttributesSeed = async (transaction: Transaction, adminUserId: string) => {
	const jsonData: Array<any> = JSON.parse(fs.readFileSync(`${__dirname}/subCategoryAttributes.json`, "utf-8"));
	const subCategoryData = await SubCategory.findAll({ where: { is_deleted: false }, raw: true, transaction });
	const attributesData = await Attributes.findAll({ where: { is_deleted: false }, raw: true, transaction });

	let tableData: Array<SubCategoryAttributesInput> = [];

	for (const data of jsonData) {
		const subCategoryId = subCategoryData.find((row) => row.name == data.subcategory);
		const attributeId = attributesData.find((row) => row.name == data.attributes);

		if (subCategoryId && attributeId) {
			tableData.push({
				sub_category_id: subCategoryId.id,
				attribute_id: attributeId.id,
				last_updated_by: adminUserId,
			});
		}
	}

	const subCategoryAttributesData = await SubCategoryAttributes.findAll({ raw: true, transaction });
	tableData = tableData.filter(
		(newData) =>
			subCategoryAttributesData.findIndex((data) => data.sub_category_id == newData.sub_category_id && data.attribute_id == newData.attribute_id) < 0
	);

	return await SubCategoryAttributes.bulkCreate(tableData, { ignoreDuplicates: true, transaction, returning: true }).then((data) => {
		logger.info(`SubCategoryAttributes seeder ran successfully. Total ${data.length} SubCategoryAttributes seeded`);
		return data;
	});
};

export default subCategoryAttributesSeed;
