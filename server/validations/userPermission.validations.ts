export default class UserPermissionValidations {
	public UserPermission = {
		user_id: "required|uuid",
		permissionDetails: "required|array|min:1",
		"permissionDetails.*.permission_master_id": "required|uuid",
		"permissionDetails.*.view": "boolean",
		"permissionDetails.*.create": "boolean",
		"permissionDetails.*.edit": "boolean",
		"permissionDetails.*.delete": "boolean",
	};

	public ToggleUserPermission = {
		view: "boolean",
		create: "boolean",
		edit: "boolean",
		delete: "boolean",
	};
}
