import { Transaction } from "sequelize";
import { OtherDetailMaster, OtherDetailMasterInput } from "../../models";
import jsonData from "./otherDetailMaster.json";
import { logger } from "../../config";

const otherDetailMasterSeed = async (transaction: Transaction, adminUserId: string | undefined) => {
	let tableData: Array<OtherDetailMasterInput> = jsonData.map((data, i) => {
		return {
			detail_name: data.name,
			detail_type: data.type,
			last_updated_by: adminUserId,
		} as OtherDetailMasterInput;
	});
	const attributesData = (await OtherDetailMaster.findAll({ attributes: ["detail_name"], raw: true })).map((data) => data.detail_name);
	tableData = tableData.filter((data) => attributesData.indexOf(data.detail_name) < 0);

	return await OtherDetailMaster.bulkCreate(tableData, { ignoreDuplicates: true, transaction, returning: true }).then((data) => {
		logger.info(`Other Detail Master seeder ran successfully. Total ${data.length} details seeded`);
		return data;
	});
};

export default otherDetailMasterSeed;
