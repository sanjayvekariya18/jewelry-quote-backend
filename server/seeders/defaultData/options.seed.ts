import { Transaction } from "sequelize";
import logger from "../../config/logger";
import { Options, OptionsInput } from "../../models";
import jsonData from "./options.json";

const optionSeed = async (transaction: Transaction, adminUserId: string | undefined) => {
	// const jsonData: Array<any> = JSON.parse(fs.readFileSync(`${__dirname}/options.json`, "utf-8"));
	let tableData: Array<OptionsInput> = jsonData.map((data) => {
		return {
			name: data.name,
			last_updated_by: adminUserId,
		} as OptionsInput;
	});
	const optionsData = (await Options.findAll({ where: { is_deleted: false }, attributes: ["name"], raw: true, transaction })).map(
		(data) => data.name
	);
	tableData = tableData.filter((data) => optionsData.indexOf(data.name || "") < 0);

	return await Options.bulkCreate(tableData, { ignoreDuplicates: true, transaction, returning: true }).then((data) => {
		logger.info(`Options seeder ran successfully. Total ${data.length} options seeded`);
		return data;
	});
};

export default optionSeed;
