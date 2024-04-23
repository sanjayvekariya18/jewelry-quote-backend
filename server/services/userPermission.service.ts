import { UserPermissionsDTO, ToggleUserPermissionDTO } from "../dto";
import { QueryTypes } from "sequelize";
import { UserPermissions } from "../models";
import { sequelizeConnection } from "../config/database";
import _ from "lodash";
import { helper } from "../utils";

export default class UserPermissionsService {
	public getAll = async (user_id: string) => {
		const dbData: Array<any> = await sequelizeConnection.query(
			`
			SELECT 
				USERPERMISSIONS.id,
				USERPERMISSIONS.permission_master_id,
				PERMISSIONMASTER.permissionName as permissionName,
				PERMISSIONMASTER.permissionGroup as permissionGroup,
				USERPERMISSIONS.view,
				USERPERMISSIONS.create,
				USERPERMISSIONS.edit,
				USERPERMISSIONS.delete
			FROM user_permissions as USERPERMISSIONS
			LEFT JOIN permission_master as PERMISSIONMASTER on PERMISSIONMASTER.id = USERPERMISSIONS.permission_master_id
			WHERE USERPERMISSIONS.user_id = '${user_id}'
			ORDER BY PERMISSIONMASTER.permissionGroup ASC, PERMISSIONMASTER.permissionName ASC
		`,
			{ type: QueryTypes.SELECT }
		);

		const resData: any = {};

		for (const data of dbData) {
			if (!resData[data.permissionGroup]) {
				resData[data.permissionGroup] = [];
			}
			resData[data.permissionGroup].push(data);
		}

		return resData;
	};

	public permissionsNotAssigned = async (user_id: string) => {
		const dbData: Array<any> = await sequelizeConnection.query(
			`
			SELECT 
                PERMISSIONMASTER.ID,
                permissionName,
                permissionGroup
            FROM permission_master AS PERMISSIONMASTER
            LEFT JOIN user_permissions AS USERPERMISSIONS ON USERPERMISSIONS.permission_master_id = PERMISSIONMASTER.ID
            AND USERPERMISSIONS.user_id = '${user_id}'
            WHERE USERPERMISSIONS.ID IS NULL
            ORDER BY PERMISSIONMASTER.permissionGroup ASC, PERMISSIONMASTER.permissionName ASC
		`,
			{ type: QueryTypes.SELECT }
		);

		const resData: any = {};

		for (const data of dbData) {
			if (!resData[data.permissionGroup]) {
				resData[data.permissionGroup] = [];
			}
			resData[data.permissionGroup].push(data);
		}

		return resData;
	};

	public create = async (permissionData: UserPermissionsDTO) => {
		return await UserPermissions.bulkCreate(permissionData.UserPermissions, {
			updateOnDuplicate: ["id"],
			returning: true,
		});
	};

	public toggleUserPermission = async (userPermissionId: string, permissionsData: ToggleUserPermissionDTO) => {
		return await UserPermissions.update(permissionsData, {
			where: { id: userPermissionId },
			returning: true,
		});
	};

	public delete = async (userPermissionId: string) => {
		return await UserPermissions.destroy({ where: { id: userPermissionId } });
	};

	public getAssignedUserIdsByPermission = async (permissionName: string) => {
		const dbData: Array<any> = await sequelizeConnection.query(
			`
			select up.user_id as user_id from user_permissions as up 
				JOIN permission_master as pm ON pm.id = up.permission_master_id and pm.permissionName = '${permissionName}';
		`,
			{ type: QueryTypes.SELECT }
		);

		if (helper.isEmpty(dbData)) {
			return [];
		}

		return _.map(dbData, "user_id") || [];
	};
}
