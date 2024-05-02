import { Op } from "sequelize";
import { StyleMaster, StyleMasterOutput } from "../models";
import { sequelizeConnection } from "../config/database";
import { SearchStyleMasterDTO } from "../dto";

interface MenuJson {
	style_master_id: string;
	name: string;
	sub_category_id: string;
	childMenu?: Array<MenuJson>;
}

export default class StyleMasterService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchStyleMasterDTO) => {
		return await StyleMaster.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					title: {
						[Op.iLike]: "%" + searchParams.searchTxt + "%",
					},
				}),
				parent_id: searchParams.parent_id ? searchParams.parent_id : null,
				// is_deleted: false,
			},
			include: [{ model: StyleMaster, attributes: [], as: "parent_menu" }],
			// order: [[searchParams.orderBy, searchParams.order]],
			attributes: ["id", "parent_id", [this.Sequelize.col("parent_menu.name"), "parent_name"], "sub_category_id", "name"],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public getList = async () => {
		return await StyleMaster.findAll({
			// where: { is_deleted: false },
			attributes: ["id", "parent_id", "name"],
		});
	};

	public getMenu = async () => {
		const menuDbData = await StyleMaster.findAll({
			// where: { is_deleted: false },
			order: [["parent_id", "ASC"]],
			raw: true,
		});

		const mainMenuData = menuDbData.filter((rows) => rows.parent_id == null);

		const menuData: Array<MenuJson> = [];

		for (const mainMenu of mainMenuData) {
			const newMenu: MenuJson = {
				style_master_id: mainMenu.id,
				name: mainMenu.name,
				sub_category_id: mainMenu.sub_category_id,
				childMenu: [],
			};
			const menuItem = this.createMenu(newMenu, menuDbData);
			menuData.push(menuItem);
		}

		return menuData;
	};

	private createMenu = (menuData: MenuJson, menuDbData: Array<StyleMasterOutput>): MenuJson => {
		const childMenus = menuDbData.filter((row) => row.parent_id == menuData.style_master_id);

		for (const child of childMenus) {
			const newMenu: MenuJson = {
				style_master_id: child.id,
				name: child.name,
				sub_category_id: child.sub_category_id,
				childMenu: [],
			};
			menuData.childMenu?.push(newMenu);
			this.createMenu(newMenu, menuDbData);
		}

		return menuData;
	};

	public findOne = async (searchObject: any) => {
		return await StyleMaster.findOne({
			where: searchObject,
			attributes: ["id", "parent_id", [this.Sequelize.col("parent_menu.name"), "parent_name"], "sub_category_id", "name"],
		});
	};

	public getStyleAsPerSubCategoryId = async (sub_category_id: string) => {
		const data = await StyleMaster.findAll({
			where: {
				sub_category_id,
			},
		});

		const mainMenuData = data.filter((rows) => rows.parent_id == null);

		const menuData: Array<MenuJson> = [];

		for (const mainMenu of mainMenuData) {
			const newMenu: MenuJson = {
				style_master_id: mainMenu.id,
				name: mainMenu.name,
				sub_category_id: mainMenu.sub_category_id,
				childMenu: [],
			};
			const menuItem = this.createMenu(newMenu, data);
			menuData.push(menuItem);
		}

		return menuData;
	};

	// public create = async (dynamicMenuData: CreateDynamicMenuDTO, loggedInUserId: string) => {
	// 	const data: any = await executeTransaction(async (transaction: Transaction) => {
	// 		await this.updatePosition(dynamicMenuData, transaction);

	// 		const newRecord = await DynamicMenu.create(dynamicMenuData, { transaction });

	// 		if (newRecord.total_positions) {
	// 			for (let i = 0; i < newRecord.total_positions; i++) {
	// 				let LinkUpData: any = [
	// 					{
	// 						menu_id: newRecord.menu_id,
	// 						position: 1 + i,
	// 						type: POSITION_TYPE.Banner,
	// 						slider_id: null,
	// 						banner_id: null,
	// 						created_by: loggedInUserId,
	// 					},
	// 				];
	// 				await LinkUp.bulkCreate(LinkUpData, { transaction });
	// 			}
	// 		}
	// 		return newRecord;
	// 	});

	// 	return await this.findOne({ menu_id: data.menu_id });
	// };

	// public edit = async (dynamicMenuId: string, dynamicMenuData: EditDynamicMenuDTO, loggedInUserId: string) => {
	// 	await executeTransaction(async (transaction: Transaction) => {
	// 		await this.updatePosition(dynamicMenuData, transaction, dynamicMenuId);
	// 		return await DynamicMenu.update(dynamicMenuData, { where: { menu_id: dynamicMenuId, is_deleted: false }, transaction });
	// 	});
	// 	const data = await LinkUp.findAll({
	// 		where: {
	// 			menu_id: dynamicMenuId,
	// 		},
	// 		order: [["position", "ASC"]],
	// 	});
	// 	if (dynamicMenuData.total_positions) {
	// 		if (dynamicMenuData.total_positions < data.length) {
	// 			for (let i = dynamicMenuData.total_positions; i < data.length; i++) {
	// 				await LinkUp.destroy({ where: { link_up_id: data[i].link_up_id } });
	// 			}
	// 		}
	// 		if (dynamicMenuData.total_positions > data.length) {
	// 			// const bannerData: any = await this.bannerService.getDefaultBanner();
	// 			for (let i = data.length; i < dynamicMenuData.total_positions; i++) {
	// 				let LinkUpData: any = [
	// 					{
	// 						menu_id: dynamicMenuId,
	// 						position: 1 + i,
	// 						type: POSITION_TYPE.Banner,
	// 						slider_id: null,
	// 						banner_id: null,
	// 						created_by: loggedInUserId,
	// 					},
	// 				];
	// 				await LinkUp.bulkCreate(LinkUpData);
	// 			}
	// 		}
	// 	} else {
	// 		await LinkUp.destroy({ where: { menu_id: dynamicMenuId } });
	// 	}

	// 	return await this.findOne({ menu_id: dynamicMenuId });
	// };

	// public delete = async (dynamicMenuId: string, loggedInUserId: string) => {
	// 	return await DynamicMenu.update({ is_deleted: true, updated_by: loggedInUserId }, { where: { menu_id: dynamicMenuId } });
	// };
}
