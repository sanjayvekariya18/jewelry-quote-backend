import { Transaction } from "sequelize";
import { executeTransaction, sequelizeConnection } from "../../config/database";
import logger from "../../config/logger";
import adminUserSeed from "./adminUser.seed";
import permissionMasterSeed from "./permissionMaster.seed";

import initSchemaRelationship from "../../InitialDBSetup/initSchemaRelationship";

class DataSeed {
	static async run() {
		await sequelizeConnection
			.authenticate()
			.then(async () => {
				logger.info(`Database Connected`);
			})
			.catch((error) => {
				logger.error(`Unable to connect to the database: ${error}`);
			});

		await executeTransaction(async (transaction: Transaction) => {
			initSchemaRelationship();
			try {
				const adminUser = await adminUserSeed(transaction);
				await permissionMasterSeed(transaction, adminUser.id);
			} catch (error) {
				transaction.rollback();
				logger.error(`Error occurred in seeder : ${error}`);
			}
		});
	}
}

DataSeed.run();
