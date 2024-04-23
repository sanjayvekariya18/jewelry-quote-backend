import { Dialect, Sequelize, Transaction } from "sequelize";
import config from "./config";

const dbName = config.db.dbname as string;
const dbUser = config.db.username as string;
const dbHost = config.db.host;
const dbDriver = config.db.dialect as Dialect;
const dbPassword = config.db.password;
const dbPort = config.db.port;

export const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
	host: dbHost,
	dialect: dbDriver,
	port: dbPort,
	logging: false,
	timezone: "+05:30", // for writing to database
});

export const executeTransaction = (callBack: (transaction: Transaction) => any) => {
	return sequelizeConnection.transaction(
		{
			isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
		},
		(t) => callBack(t)
	);
};
