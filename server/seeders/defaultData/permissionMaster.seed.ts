import { PermissionMaster, UserPermissions } from "../../models";
import { PermissionMasterAttributes, UserPermissionsInput } from "../../models";
import { Transaction } from "sequelize";
import { logger } from "../../config";
import jsonData from "./permissionData.json";

const permissionMasterSeed = async (transaction: Transaction, adminId: string) => {
	// Check existing
	const dbPermissionsData = await PermissionMaster.findAll({ transaction, raw: true });
	const permissionsJSON = jsonData.filter((data) => dbPermissionsData.findIndex((row) => row.permissionName == data.permissionName) < 0);

	const permissionsData: Array<PermissionMasterAttributes> = permissionsJSON.map((data) => {
		return {
			...data,
		} as PermissionMasterAttributes;
	});

	// Bulk create permission
	const permissions = await PermissionMaster.bulkCreate(permissionsData, { ignoreDuplicates: true, transaction, returning: true });

	// Add permissions to admin user
	const userPermissions: Array<UserPermissionsInput> = permissions.map((permission) => {
		return {
			user_id: adminId,
			permission_master_id: permission.id,
			view: true,
			create: true,
			edit: true,
			delete: true,
			last_updated_by: adminId,
		};
	});
	if (userPermissions && userPermissions.length > 0) {
		await UserPermissions.bulkCreate(userPermissions, { ignoreDuplicates: true, transaction }).then((data) => {
			logger.info(`Permissions Master seeder ran successfully. Total ${data.length} permissions seeded`);
			return data;
		});
	}
};

export default permissionMasterSeed;
