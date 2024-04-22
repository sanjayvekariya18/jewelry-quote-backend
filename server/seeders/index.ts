import { sequelizeConnection } from "../config/database";
import logger from "../config/logger";
import createTables from "./createTables.seed";

class DatabaseSeed {
	static async run() {
		await sequelizeConnection
			.authenticate()
			.then(async () => {
				logger.info(`Database Connected`);
				await createTables();
			})
			.catch((error) => {
				logger.error(`Unable to connect to the database: ${error}`);
			});
	}
}

DatabaseSeed.run();
