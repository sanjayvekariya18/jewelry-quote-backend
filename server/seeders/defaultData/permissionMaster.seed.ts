import { PermissionMaster, UserPermissions } from "../../models";
import { PermissionMasterAttributes, UserPermissionsInput } from "../../models";
import { Transaction } from "sequelize";
import { logger } from "../../config";
import jsonData from "./permissionData.json";

const permissionMasterSeed = async (transaction: Transaction) => {
	// Check existing
	const dbPermissionsData = await PermissionMaster.findAll({ transaction, raw: true });
	const permissionsJSON = jsonData.filter((data) => dbPermissionsData.findIndex((row) => row.permissionName == data.permissionName) < 0);

	const permissionsData: Array<PermissionMasterAttributes> = permissionsJSON.map((data) => {
		return {
			...data,
		} as PermissionMasterAttributes;
	});

	// Bulk create permission
	if (permissionsData && permissionsData.length > 0) {
		return await PermissionMaster.bulkCreate(permissionsData, { ignoreDuplicates: true, transaction, returning: true }).then((data) => {
			logger.info(`Permissions Master seeder ran successfully. Total ${data.length} permissions seeded`);
			return data;
		});
	}
};

export default permissionMasterSeed;
