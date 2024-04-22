import bcrypt from "bcryptjs";
import { QueryTypes, Transaction } from "sequelize";
import { uuidv4 } from "../../utils/helper";
import logger from "../../config/logger";
import { sequelizeConnection } from "../../config/database";
import { UserMaster, UserMasterInput } from "../../models";

const adminUserSeed = async (transaction: Transaction) => {
	const adminEmail = "admin@gmail.com";
	const userExist = await UserMaster.findOne({ where: { email: adminEmail }, raw: true, transaction });
	if (!userExist) {
		const hashedPassword: any = await bcrypt.hash("admin@123", 8);
		const dummyUserID = uuidv4();

		const adminUser: UserMasterInput = {
			name: "Admin",
			email: adminEmail,
			password: hashedPassword,
			last_updated_by: dummyUserID,
		};

		await sequelizeConnection.query(
			`
			SET FOREIGN_KEY_CHECKS=0;
		`,
			{ type: QueryTypes.UPDATE, transaction }
		);

		return await UserMaster.create(adminUser, { transaction, raw: true }).then(async (newUser: any) => {
			await sequelizeConnection.query(
				`
				SET FOREIGN_KEY_CHECKS=1;
			`,
				{ type: QueryTypes.UPDATE, transaction }
			);

			logger.info(`Admin user created with email '${adminEmail}'.`);
			return newUser;
		});
	} else {
		logger.warn(`Admin user already exists. Try '${adminEmail}' as email.`);
		return userExist;
	}
};

export default adminUserSeed;
