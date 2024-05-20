import { Op } from "sequelize";
import { ChangePasswordDTO, CreateUserDTO, EditUserDTO, SearchUserDTO } from "../dto";
import { UserMaster } from "../models";
import { sequelizeConnection } from "../config/database";
import { hashPassword } from "../utils/bcrypt.helper";
import { USER_TYPES } from "../enum";

export default class UserService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchUserDTO, loggedInUserId: string) => {
		return await UserMaster.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					[Op.or]: [{ name: { [Op.like]: `%${searchParams.searchTxt}%` } }, { email: { [Op.like]: `${searchParams.searchTxt}%` } }],
				}),
				id: { [Op.not]: loggedInUserId },
				user_type: { [Op.not]: USER_TYPES.ADMIN },
				is_deleted: false,
				...(searchParams.is_active != undefined && {
					is_active: searchParams.is_active,
				}),
			},
			attributes: ["id", "name", "email", "mobile_number", "is_active"],
			order: [["name", "ASC"]],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any, includePassword: boolean = false) => {
		return await UserMaster.findOne({
			where: { ...searchObject, is_deleted: false },
			attributes: ["id", "name", "email", "mobile_number", "user_type", ...(includePassword == true ? ["password"] : []), "is_active"],
			raw: true,
		});
	};

	public create = async (tableData: CreateUserDTO) => {
		tableData.password = await hashPassword(tableData.password);

		return await UserMaster.create(tableData).then(async () => {
			return `User created successfully`;
		});
	};

	public edit = async (id: string, tableData: EditUserDTO) => {
		return await UserMaster.update(tableData, { where: { id } }).then(async () => {
			return `User edited successfully`;
		});
	};

	public changePassword = async (userId: string, passwordData: ChangePasswordDTO) => {
		const hashedPassword: any = await hashPassword(passwordData.newPassword);
		return await UserMaster.update({ password: hashedPassword, last_updated_by: userId }, { where: { id: userId } });
	};

	public toggleUserActive = async (userId: string, loggedInUserId: string) => {
		return await UserMaster.update(
			{
				is_active: this.Sequelize.literal(`Not \`is_active\``),
				last_updated_by: loggedInUserId,
			},
			{ where: { id: userId } }
		).then(async () => {
			return await this.findOne({ id: userId });
		});
	};

	public delete = async (id: string, last_updated_by: string) => {
		return await UserMaster.update({ is_deleted: true, last_updated_by }, { where: { id } });
	};
}
