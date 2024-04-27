import fs from "fs";
import { Transaction } from "sequelize";
import { Attributes, Options } from "../../models";
import { AttributesOptions, AttributesOptionsAttribute } from "../../models";
import { logger } from "../../config";
import jsonData from "./attributeOptions.json";

const attributeOptionsSeed = async (transaction: Transaction, adminUserId: string | undefined) => {
	// const jsonData: Array<any> = JSON.parse(fs.readFileSync(`${__dirname}/attributeOptions.json`, "utf-8"));
	const attributesData = await Attributes.findAll({ where: { is_deleted: false }, raw: true, transaction });
	const optionsData = await Options.findAll({ where: { is_deleted: false }, raw: true, transaction });

	let tableData: Array<AttributesOptionsAttribute> = [];
	let lastAttributeId = "";
	for (const data of jsonData) {
		const attributeId = attributesData.find((row) => row.name == data.attribute);
		const optionId = optionsData.find((row) => row.name == data.option);
		if (attributeId && optionId) {
			tableData.push({
				attribute_id: attributeId.id,
				option_id: optionId.id,
				last_updated_by: adminUserId,
			} as AttributesOptionsAttribute);
			lastAttributeId = attributeId.id;
		}
	}

	const attributeOptionsData = await AttributesOptions.findAll({ raw: true, transaction });
	tableData = tableData.filter(
		(newData) => attributeOptionsData.findIndex((data) => data.attribute_id == newData.attribute_id && data.option_id == newData.option_id) < 0
	);

	return await AttributesOptions.bulkCreate(tableData, { ignoreDuplicates: true, transaction, returning: true }).then((data) => {
		logger.info(`AttributesOptions seeder ran successfully. Total ${data.length} AttributesOptions seeded`);
		return data;
	});
};

export default attributeOptionsSeed;
