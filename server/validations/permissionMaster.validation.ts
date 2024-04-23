export default class PermissionMasterValidation {
	public create = {
		permissionName: "required|string",
		permissionGroup: "required|string",
	};
}
