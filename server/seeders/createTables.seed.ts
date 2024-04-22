import { logger } from "../config";
import { Category, SubCategory, UserMaster } from "../models";

const createTables = async () => {
	const successFullTable: Array<string> = [];
	const errorTable: Array<string> = [];

	await UserMaster.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`UserMaster Table Created`);
		})
		.catch((error) => {
			errorTable.push(`UserMaster Table Error : ${error}`);
		});

	await Category.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Category Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Category Table Error : ${error}`);
		});

	await SubCategory.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`SubCategory Table Created`);
		})
		.catch((error) => {
			errorTable.push(`SubCategory Table Error : ${error}`);
		});

	const totalTable = successFullTable.length + errorTable.length;

	logger.info(`Total Tables In Master Database : ${totalTable}`);
	if (successFullTable.length > 0) {
		logger.info(`Tables Created In Master Database`);
		successFullTable.forEach((message: string, index: number) => {
			logger.warn(`${index + 1}/${totalTable} - ${message}`);
		});
	}
	if (errorTable.length > 0) {
		logger.error(`Tables Failed In Master Database`);
		errorTable.forEach((message) => {
			logger.error(message);
		});
	}
};

export default createTables;
