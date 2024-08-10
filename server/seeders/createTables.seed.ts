import { logger } from "../config";
import {
	ATQAttributeOptions,
	ATQOtherDetail,
	AddToQuote,
	Attributes,
	AttributesOptions,
	CatalogMaster,
	CatalogProducts,
	Category,
	CustomerDetails,
	EmailSubscribed,
	EnquiryNow,
	ForgotPassword,
	HomePageSetup,
	Options,
	OtherDetailMaster,
	PermissionMaster,
	ProductAttributeOptions,
	ProductOtherDetail,
	Products,
	QuotationAttributeOptions,
	QuotationMaster,
	QuotationOtherDetail,
	QuotationProduct,
	StyleMaster,
	SubCategory,
	SubCategoryAttributes,
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

	await Attributes.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Attributes Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Attributes Table Error : ${error}`);
		});

	await Options.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`Options Table Created`);
		})
		.catch((error) => {
			errorTable.push(`Options Table Error : ${error}`);
		});

	await AttributesOptions.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`AttributesOptions Table Created`);
		})
		.catch((error) => {
			errorTable.push(`AttributesOptions Table Error : ${error}`);
		});

	await SubCategoryAttributes.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`SubCategoryAttributes Table Created`);
		})
		.catch((error) => {
			errorTable.push(`SubCategoryAttributes Table Error : ${error}`);
		});

	await ProductAttributeOptions.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`ProductAttributeOptions Table Created`);
		})
		.catch((error) => {
			errorTable.push(`ProductAttributeOptions Table Error : ${error}`);
		});

	await AddToQuote.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`AddToQuote Table Created`);
		})
		.catch((error) => {
			errorTable.push(`AddToQuote Table Error : ${error}`);
		});

	await ATQAttributeOptions.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`ATQAttributeOptions Table Created`);
		})
		.catch((error) => {
			errorTable.push(`ATQAttributeOptions Table Error : ${error}`);
		});

	await QuotationMaster.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`QuotationMaster Table Created`);
		})
		.catch((error) => {
			errorTable.push(`QuotationMaster Table Error : ${error}`);
		});

	await QuotationProduct.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`QuotationProduct Table Created`);
		})
		.catch((error) => {
			errorTable.push(`QuotationProduct Table Error : ${error}`);
		});

	await QuotationAttributeOptions.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`QuotationAttributeOptions Table Created`);
		})
		.catch((error) => {
			errorTable.push(`QuotationAttributeOptions Table Error : ${error}`);
		});

	await StyleMaster.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`StyleMaster Table Created`);
		})
		.catch((error) => {
			errorTable.push(`StyleMaster Table Error : ${error}`);
		});

	await OtherDetailMaster.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`OtherDetailMaster Table Created`);
		})
		.catch((error) => {
			errorTable.push(`OtherDetailMaster Table Error : ${error}`);
		});

	await ProductOtherDetail.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`ProductOtherDetail Table Created`);
		})
		.catch((error) => {
			errorTable.push(`ProductOtherDetail Table Error : ${error}`);
		});

	await ATQOtherDetail.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`ATQOtherDetail Table Created`);
		})
		.catch((error) => {
			errorTable.push(`ATQOtherDetail Table Error : ${error}`);
		});

	await QuotationOtherDetail.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`QuotationOtherDetail Table Created`);
		})
		.catch((error) => {
			errorTable.push(`QuotationOtherDetail Table Error : ${error}`);
		});

	await HomePageSetup.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`HomePageSetup Table Created`);
		})
		.catch((error) => {
			errorTable.push(`HomePageSetup Table Error : ${error}`);
		});

	await EmailSubscribed.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`EmailSubscribed Table Created`);
		})
		.catch((error) => {
			errorTable.push(`EmailSubscribed Table Error : ${error}`);
		});

	await ForgotPassword.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`ForgotPassword Table Created`);
		})
		.catch((error) => {
			errorTable.push(`ForgotPassword Table Error : ${error}`);
		});

	await EnquiryNow.sync({ alter: { drop: false } })
		.then(() => {
			successFullTable.push(`EnquiryNow Table Created`);
		})
		.catch((error) => {
			errorTable.push(`EnquiryNow Table Error : ${error}`);
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
