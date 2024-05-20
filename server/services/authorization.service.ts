import { sequelizeConnection } from "../config/database";
import { PermissionMaster, UserPermissions } from "../models";
import UserMasterService from "./userMaster.service";

export interface PermissionDetails {
	name: string;
	view: boolean;
	create: boolean;
	edit: boolean;
	delete: boolean;
}

export interface LoggedInUserDetails {
	id: string;
	name: string;
	user_type: string;
	permissions: Array<PermissionDetails>;
}

export interface LoggedInUserTokenPayload {
	user: LoggedInUserDetails;
	expires: number;
}

export interface LoggedInCustomerDetails {
	id: string;
	customer_name: string;
	customer_email: string;
	mobile_number: string | null;
}

export interface LoggedInCustomerTokenPayload {
	customer: LoggedInCustomerDetails;
	expires: number;
}

export default class AuthorizationService {
	private userMasterServices = new UserMasterService();
	public findUserById = async (userId: string) => {
		const userData = await this.userMasterServices.findOne({ id: userId });

		const permissionsData = await UserPermissions.findAll({
			where: { user_id: userId },
			include: [{ model: PermissionMaster, attributes: [] }],
			attributes: [
				"id",
				"user_id",
				"permission_master_id",
				[sequelizeConnection.Sequelize.col("PermissionMaster.permissionName"), "permission_name"],
				"view",
				"create",
				"edit",
				"delete",
			],
			raw: true,
		});
		const permissions: Array<PermissionDetails> = permissionsData.map((permission: any) => {
			return {
				name: permission.permission_name,
				view: permission.view,
				create: permission.create,
				edit: permission.edit,
				delete: permission.delete,
			} as PermissionDetails;
		});

		return {
			id: userId,
			name: userData?.name || "",
			user_type: userData?.user_type || "",
			is_active: userData?.is_active || false,
			permissions: permissions || [],
		};
	};
}
