import { sequelizeConnection } from "../config/database";
import logger from "../config/logger";
import initSchemaRelationship from "./initSchemaRelationship";

const testDBConnections = async () => {
	// Test Master DB Connections
	await sequelizeConnection
		.authenticate()
		.then(async () => {
			logger.info(`DB Connected`);
			// Add All Relationships
			initSchemaRelationship();
		})
		.catch((error) => {
			logger.error(`Unable to connect to the database: ${error}`);
		});
};

export default testDBConnections;
