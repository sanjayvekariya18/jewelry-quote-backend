export class SearchPermissionDTO {
	page: number;
	rowsPerPage: number;

	constructor(data: any) {
		this.page = data.page != undefined ? Number(data.page) : 0;
		this.rowsPerPage = data.rowsPerPage != undefined ? Number(data.rowsPerPage) : 10;
	}
}

export class CreatePermissionDTO {
	permissionName: string;
	permissionGroup: string;

	constructor(data: any) {
		this.permissionName = data.permissionName.trim();
		this.permissionGroup = data.permissionGroup.trim();
	}
}
