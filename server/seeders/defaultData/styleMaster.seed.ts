import { Transaction } from "sequelize";
import jsonData from "./styleMaster.json";
import { StyleMaster, SubCategory } from "../../models";
import { isEmpty, uuidv4 } from "../../utils/helper";
import { sequelizeConnection } from "../../config/database";
import { logger } from "../../config";

const styleMasterSeed = async (transaction: Transaction, adminUserId: string | undefined) => {
	const Sequelize = sequelizeConnection.Sequelize;

	const styleMasterData: any = await StyleMaster.findAll({
		attributes: ["id", "parent_id", "sub_category_id", "name", [Sequelize.col("parent_style.name"), "parent_name"]],
		include: [{ model: StyleMaster, attributes: [], as: "parent_style" }],
		transaction,
	}).then((data) => data.map((row) => row.get({ plain: true })));

	const getSubCategories = await SubCategory.findAll({ where: { is_deleted: false }, raw: true, transaction });

	let newTableData: Array<any> = [];
	jsonData.map((data) => {
		const findSubCate = getSubCategories.find((data1) => data1.name == data.sub_category);
		if (findSubCate) {
			const style_id = uuidv4();
			const subCatID = findSubCate.id;
			newTableData.push({ id: style_id, name: data.name, parent_name: data.parent_name, sub_category_id: subCatID });
		}
	});

	let newArray: Array<any> = [];
	newTableData.map((newStyle: any) => {
		const isRepeat = styleMasterData.find(
			(styleDB: any) =>
				newStyle.id != styleDB.id &&
				styleDB.name == newStyle.name &&
				styleDB.sub_category_id == newStyle.sub_category_id &&
				(isEmpty(styleDB.parent_name) == isEmpty(newStyle.parent_name) || styleDB.parent_name == newStyle.parent_name)
		);
		if (!isRepeat) {
			newArray.push({ ...newStyle, last_updated_by: adminUserId });
		}
	});

	newArray = newArray.map((data) => {
		if (data.parent_name) {
			const findParent = styleMasterData.find((styleDB: any) => styleDB.name == data.parent_name && styleDB.sub_category_id == data.sub_category_id);
			if (findParent) {
				return { ...data, parent_id: findParent.id };
			} else {
				const findParentInArr = newArray.find((arr) => arr.name == data.parent_name && arr.sub_category_id == data.sub_category_id);
				if (findParentInArr) {
					return { ...data, parent_id: findParentInArr.id };
				}
			}
		} else {
			return data;
		}
	});

	await StyleMaster.bulkCreate(newArray, { ignoreDuplicates: true, transaction });
	logger.info(`Style master seeder ran successfully. Total ${newArray.length} styles seeded`);
	return newArray;
};

export default styleMasterSeed;
