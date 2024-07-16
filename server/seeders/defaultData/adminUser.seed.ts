import bcrypt from "bcryptjs";
import { QueryTypes, Transaction } from "sequelize";
import { uuidv4 } from "../../utils/helper";
import logger from "../../config/logger";
import { sequelizeConnection } from "../../config/database";
import { PermissionMaster, UserMaster, UserMasterInput, UserPermissions, UserPermissionsInput } from "../../models";
import { USER_TYPES } from "../../enum";

const adminUserSeed = async (transaction: Transaction) => {
	const adminEmail = "montypatel1990@gmail.com";
	let adminUser = await UserMaster.findOne({ where: { email: adminEmail }, raw: true, transaction });
	const dbPermissionsData = await PermissionMaster.findAll({ transaction, raw: true });

	if (!adminUser) {
		const hashedPassword: any = await bcrypt.hash("!T@ly105", 8);
		const dummyUserID = uuidv4();

		const newAdminUser: UserMasterInput = {
			name: "Admin",
			email: adminEmail,
			password: hashedPassword,
			user_type: USER_TYPES.ADMIN,
			last_updated_by: dummyUserID,
		};

		// Remove foreign key check
		await sequelizeConnection.query(`SET FOREIGN_KEY_CHECKS=0;`, { type: QueryTypes.UPDATE, transaction });

		await UserMaster.create(newAdminUser, { transaction, raw: true }).then(async (newUser) => {
			// Added foreign key check
			await sequelizeConnection.query(`SET FOREIGN_KEY_CHECKS=1;`, { type: QueryTypes.UPDATE, transaction });
			adminUser = newUser;
		});
	}

	const getAllUserPermissions = await UserPermissions.findAll({ where: { user_id: adminUser?.id } });
	const perNotFoundInAdmin = dbPermissionsData
		.filter((data) => getAllUserPermissions.findIndex((row) => row.permission_master_id == data.id) < 0)
		.map((permission) => {
			return {
				user_id: adminUser?.id || "",
				permission_master_id: permission.id,
				view: true,
				create: true,
				edit: true,
				delete: true,
				last_updated_by: adminUser?.id,
			};
		});
	if (perNotFoundInAdmin.length > 0) {
		await UserPermissions.bulkCreate(perNotFoundInAdmin, { ignoreDuplicates: true, transaction });
	}
	logger.info(`Admin user email - '${adminEmail}'.`);

	return adminUser;
};

export default adminUserSeed;
