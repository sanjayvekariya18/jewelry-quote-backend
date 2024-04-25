import { logger } from "../config";
import {
	CatalogMaster,
	CatalogProducts,
	Category,
	CustomerDetails,
	PermissionMaster,
	Products,
	SubCategory,
	UserMaster,
	UserPermissions,
	WishList,
} from "../models";

const createTables = async () => {
	const successFullTable: Array<string> = [];
	const errorTable: Array<string> = [];

	await UserMaster.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`UserMaster Table Created`);
		})
		.catch((error) => {
			errorTable.push(`UserMaster Table Error : ${error}`);
		});

	await PermissionMaster.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`PermissionMaster Table Created`);
		})
		.catch((error) => {
			errorTable.push(`PermissionMaster Table Error : ${error}`);
		});

	await UserPermissions.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`UserPermissions Table Created`);
		})
		.catch((error) => {
			errorTable.push(`UserPermissions Table Error : ${error}`);
		});

	await Category.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Category Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Category Table Error : ${error}`);
		});

	await SubCategory.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`SubCategory Table Created`);
		})
		.catch((error) => {
			errorTable.push(`SubCategory Table Error : ${error}`);
		});

	await Products.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Products Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Products Table Error : ${error}`);
		});

	await CustomerDetails.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`CustomerDetails Table Created`);
		})
		.catch((error) => {
			errorTable.push(`CustomerDetails Table Error : ${error}`);
		});

	await WishList.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`WishList Table Created`);
		})
		.catch((error) => {
			errorTable.push(`WishList Table Error : ${error}`);
		});

	await CatalogMaster.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`CatalogMaster Table Created`);
		})
		.catch((error) => {
			errorTable.push(`CatalogMaster Table Error : ${error}`);
		});

	await CatalogProducts.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`CatalogProducts Table Created`);
		})
		.catch((error) => {
			errorTable.push(`CatalogProducts Table Error : ${error}`);
		});

	const totalTable = successFullTable.length + errorTable.length;

	logger.info(`Total Tables In Master Database : ${totalTable}`);
	if (successFullTable.length > 0) {
		logger.info(`Tables Created In Master Database`);
		successFullTable.forEach((message: string, index: number) => {
			logger.warn(`${index + 1}/${totalTable} - ${message}`);
		});
	}
	if (errorTable.length > 0) {
		logger.error(`Tables Failed In Master Database`);
		errorTable.forEach((message) => {
			logger.error(message);
		});
	}
};

export default createTables;
