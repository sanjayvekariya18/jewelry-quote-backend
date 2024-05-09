import { Transaction } from "sequelize";
import logger from "../../config/logger";
import Attributes, { AttributesAttributes } from "../../models/attributes.model";
import jsonData from "./attributes.json";

const attributeSeed = async (transaction: Transaction, adminUserId: string | undefined) => {
	let tableData: Array<AttributesAttributes> = jsonData.map((data, i) => {
		return {
			name: data.name,
			last_updated_by: adminUserId,
		} as AttributesAttributes;
	});
	const attributesData = (await Attributes.findAll({ where: { is_deleted: false }, attributes: ["name"], raw: true })).map((data) => data.name);
	tableData = tableData.filter((data) => attributesData.indexOf(data.name || "") < 0);

	return await Attributes.bulkCreate(tableData, { ignoreDuplicates: true, transaction, returning: true }).then((data) => {
		logger.info(`Attributes seeder ran successfully. Total ${data.length} attributes seeded`);
		return data;
	});
};

export default attributeSeed;
