import fs from "fs";
import { Transaction } from "sequelize";
import logger from "../../config/logger";
import Attributes, { AttributesAttributes } from "../../models/attributes.model";
import { convertToSlug } from "../../utils/helper";
import jsonData from "./attributes.json";

const attributeSeed = async (transaction: Transaction, adminUserId: string | undefined) => {
	// const jsonData: Array<any> = JSON.parse(fs.readFileSync(`${__dirname}/attributes.json`, "utf-8"));
	let tableData: Array<AttributesAttributes> = jsonData.map((data, i) => {
		return {
			name: data.name,
			key: convertToSlug(data.name),
			position: i + 1,
			lastUpdatedBy: adminUserId,
		} as AttributesAttributes;
	});
	const attributesData = (await Attributes.findAll({ where: { isDeleted: false }, attributes: ["name"], raw: true })).map((data) => data.name);
	tableData = tableData.filter((data) => attributesData.indexOf(data.name || "") < 0);

	return await Attributes.bulkCreate(tableData, { ignoreDuplicates: true, transaction, returning: true }).then((data) => {
		logger.info(`Attributes seeder ran successfully. Total ${data.length} attributes seeded`);
		return data;
	});
};

export default attributeSeed;
