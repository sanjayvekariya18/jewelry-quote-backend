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
}

export interface LoggedInUserTokenPayload {
	user: LoggedInUserDetails;
	expires: number;
}

export default class AuthorizationService {
	private userMasterServices = new UserMasterService();
	public findUserById = async (userId: string) => {
		const userData = await this.userMasterServices.findOne({ id: userId, is_active: true });

		return {
			id: userId,
			name: userData?.name || "",
			is_active: userData?.is_active || false,
			// permissions: userData?.permissions || [],
		};
	};
}
