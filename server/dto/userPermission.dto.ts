class UserPermission {
	id?: string;
	user_id: string;
	permission_master_id: string;
	view: boolean;
	create: boolean;
	edit: boolean;
	delete: boolean;
	last_updated_by: string;

	constructor(data: any) {
		data.id ? (this.id = data.id) : delete this.id;
		this.user_id = data.user_id;
		this.permission_master_id = data.permission_master_id;
		this.view = data.view;
		this.create = data.create;
		this.edit = data.edit;
		this.delete = data.delete;
		this.last_updated_by = data.loggedInUserId;
	}
}

export class UserPermissionsDTO {
	user_id: string;
	UserPermissions: Array<UserPermission> = [];

	constructor(data: any) {
		this.user_id = data.user_id;
		data.permissionDetails.forEach((permission: UserPermission) => {
			this.UserPermissions.push(new UserPermission({ ...permission, user_id: data.user_id, loggedInUserId: data.loggedInUserId }));
		});
	}
}

export class ToggleUserPermissionDTO {
	view?: boolean;
	create?: boolean;
	edit?: boolean;
	delete?: boolean;
	last_updated_by: string;

	constructor(data: any) {
		data.view != undefined ? (this.view = data.view) : delete this.view;
		data.create != undefined ? (this.create = data.create) : delete this.create;
		data.edit != undefined ? (this.edit = data.edit) : delete this.edit;
		data.delete != undefined ? (this.delete = data.delete) : delete this.delete;
		this.last_updated_by = data.loggedInUserId;
	}
}
