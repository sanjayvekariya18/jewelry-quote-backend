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
			},
			include: [{ model: StyleMaster, attributes: [], as: "parent_menu" }],
			attributes: ["id", "parent_id", [this.Sequelize.col("parent_menu.name"), "parent_name"], "sub_category_id", "name"],
			offset: searchParams.rowsPerPage * searchParams.page,
			limit: searchParams.rowsPerPage,
		});
	};

	public getMenu = async () => {
		const menuDbData = await StyleMaster.findAll({
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
		const data: any = await StyleMaster.findOne({
			where: searchObject,
			attributes: ["id", "parent_id", "sub_category_id", "name"],
		});

		const getChild = await StyleMaster.findAll({ where: { parent_id: searchObject.id }, raw: true });
		const menuData: Array<MenuJson> = [];

		for (const mainMenu of getChild) {
			const newMenu: MenuJson = {
				style_master_id: mainMenu.id,
				name: mainMenu.name,
				sub_category_id: mainMenu.sub_category_id,
				childMenu: [],
			};
			const menuItem = this.createMenu(newMenu, getChild);
			menuData.push(menuItem);
		}

		return { style_master_id: data.id, name: data.name, sub_category_id: data.sub_category_id, childMenu: menuData };
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
}
