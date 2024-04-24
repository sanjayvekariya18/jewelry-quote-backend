export class SearchUserDTO {
	searchTxt?: string;
	is_active?: boolean;
	page?: number;
	rowsPerPage?: number;

	constructor(data: any) {
		data.searchTxt ? (this.searchTxt = data.searchTxt.trim()) : delete this.searchTxt;
		data.is_active != "" && data.is_active != undefined ? (this.is_active = data.is_active == "true") : delete this.is_active;
		data.page != undefined && data.page != "" ? (this.page = Number(data.page)) : delete this.page;
		data.rowsPerPage != undefined && data.rowsPerPage != "" ? (this.rowsPerPage = Number(data.rowsPerPage)) : delete this.rowsPerPage;
	}
}

export class CreateUserDTO {
	name: string;
	email: string;
	mobile_number?: string;
	password: string;
	last_updated_by: string;

	constructor(data: any) {
		this.name = data.name.trim();
		this.email = data.email.trim();
		data.mobile_number ? (this.mobile_number = data.mobile_number.trim()) : delete this.mobile_number;
		this.password = data.password;
		this.last_updated_by = data.loggedInUserId;
	}
}

export class EditUserDTO {
	name?: string;
	email?: string;
	mobile_number?: string;
	last_updated_by: string;

	constructor(data: any) {
		data.name ? (this.name = data.name.trim()) : delete this.name;
		data.email ? (this.email = data.email.trim()) : delete this.email;
		data.mobile_number ? (this.mobile_number = data.mobile_number.trim()) : delete this.mobile_number;
		this.last_updated_by = data.loggedInUserId;
	}
}

export class ChangePasswordDTO {
	oldPassword: string;
	newPassword: string;

	constructor(data: any) {
		this.oldPassword = data.oldPassword;
		this.newPassword = data.newPassword;
	}
}
