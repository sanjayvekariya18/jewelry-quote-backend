import { Transaction } from "sequelize";
import { CreatePermissionDTO, SearchPermissionDTO } from "../dto";
import { PermissionMaster, UserMaster, UserPermissions } from "../models";
import { executeTransaction } from "../config/database";
import { config } from "../config";

export default class PermissionMasterService {
	public getAll = async (searchParams: SearchPermissionDTO) => {
		return await PermissionMaster.findAndCountAll({
			attributes: ["id", "permissionName", "permissionGroup"],
			order: [
				["permissionGroup", "ASC"],
				["permissionName", "ASC"],
			],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public findOne = async (searchObject: any) => {
		return await PermissionMaster.findOne({
			where: {
				...searchObject,
			},
			attributes: ["id", "permissionName", "permissionGroup"],
			raw: true,
		});
	};

	public create = async (permissionData: CreatePermissionDTO) => {
		return executeTransaction(async (transaction: Transaction) => {
			return await PermissionMaster.create(permissionData, { transaction }).then(async (permissionMaster) => {
				const adminData = await UserMaster.findOne({ where: { email: "admin@admin.com" } });
				if (adminData) {
					await UserPermissions.create(
						{
							user_id: adminData.id,
							permission_master_id: permissionMaster.id,
							view: true,
							create: true,
							edit: true,
							delete: true,
						},
						{ transaction }
					);
				}
				return permissionMaster;
			});
		});
	};
}
