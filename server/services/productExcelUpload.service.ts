import { QueryTypes, Transaction } from "sequelize";
import { executeTransaction, sequelizeConnection } from "../config/database";
import XLSX from "xlsx";
import { BadResponseHandler } from "../errorHandler";
import ValidationHandler from "../errorHandler/validation.error.handler";
import {
	CatalogMaster,
	CatalogProducts,
	OtherDetailMaster,
	ProductAttributeOptions,
	ProductOtherDetail,
	Products,
	SubCategory,
	SubCategoryAttributes,
	SubcategoryAttribute,
} from "../models";
import styleMasterJsonData from "./../seeders/defaultData/styleMaster.json";
import { CreateCatalogDTO, ProductDTO } from "../dto";

export default class ProductExcelUploadService {
	public bulkCreateExcel = async (filename: string, loggedInUserId: string) => {
		return await executeTransaction(async (transaction: Transaction) => {
			const workbook = XLSX.readFile(`$../../public${filename}`);
			const productSheet = workbook.Sheets[workbook.SheetNames[0]];

			const productHeaders = XLSX.utils.sheet_to_json(productSheet, { header: 1, range: "A3:DZ3" }).flat();
			const productRequiredHeaders = [
				"stock_id",
				"sub_category",
				"name",
				"description",
				"catalogue_name",
				"rn_jewelry_size",
				"er_pn_jewelry_size",
				"br_nk_jewelry_size",
				"metal_type",
				"style",
				"setting_type",
				"sub_setting",
				"prong_type",
				"shank_type",
				"band_type",
				"fit_type",
				"lock_type",
				"bail_type",
				"length",
				"width",
				"thickness",
				"m950",
				"m18k",
				"m14k",
				"m10k",
				"m925",
				"p_stone_type",
				"p_stone_certificate",
				"p_stone_name",
				"p_shape",
				"p_mm_size",
				"p_piece",
				"p_color",
				"p_clarity",
				"p_carat",
				"sd1_stone_type",
				"sd1_stone_certificate",
				"sd1_stone_name",
				"sd1_shape",
				"sd1_mm_size",
				"sd1_piece",
				"sd1_color",
				"sd1_clarity",
				"sd1_carat",
				"sd2_stone_type",
				"sd2_stone_certificate",
				"sd2_stone_name",
				"sd2_shape",
				"sd2_mm_size",
				"sd2_piece",
				"sd2_color",
				"sd2_clarity",
				"sd2_carat",
				"o_stone_type",
				"o_stone_certificate",
				"o_stone_name",
				"o_shape",
				"o_mm_size",
				"o_piece",
				"o_color",
				"o_clarity",
				"o_carat",
			];

			const productHeadersNotFound = productRequiredHeaders.filter((data) => productHeaders.findIndex((head) => head === data) < 0);
			if (productHeadersNotFound.length > 0) throw new ValidationHandler(`Invalid File Format`);

			const productSheetData: Array<any> = XLSX.utils.sheet_to_json(productSheet, {
				header: 3,
				rawNumbers: true,
				range: "A3:DZ2000",
				blankrows: false,
			});

			if (productSheetData.length === 0) {
				throw new BadResponseHandler("Please provide atleast one product");
			}

			let uniqueProductStockId: any = {};
			let duplicateProductStockId: any = {};
			let undefineStockId: any = {};

			productSheetData.forEach((data, i) => {
				if (data.stock_id == undefined || data.stock_id == "") {
					undefineStockId[i + 4] = i + 4;
				}
				if (uniqueProductStockId[data.stock_id]) duplicateProductStockId[data.stock_id] = uniqueProductStockId[data.stock_id];
				else uniqueProductStockId[data.stock_id] = data.stock_id;
			});

			let error: any = {
				product: {},
			};

			if (Object.keys(duplicateProductStockId).length > 0) {
				error["product"]["duplicate"] = `Duplicate Product Stock Id(s) -> ${Object.values(duplicateProductStockId).join(", ")}`;
			}
			if (Object.keys(undefineStockId).length > 0) {
				error["product"]["notDefine"] = `Not Defined Product Stock Id(s) At Row No -> ${Object.keys(undefineStockId).join(", ")}`;
			}
			if (Object.keys(error.product).length > 0) {
				throw new ValidationHandler(error);
			}

			productSheetData.forEach((data) => Object.keys(data).forEach((k: any) => (data[k] = typeof data[k] == "string" ? data[k].trim() : data[k])));

			const allProducts = await Products.findAll({ where: { is_deleted: false }, raw: true, transaction });
			const allSubCategory = await SubCategory.findAll({ where: { is_deleted: false }, raw: true, transaction });
			// const allCatalogues = await CatalogMaster.findAll({ where: { is_deleted: false }, raw: true, transaction });
			const allOtherDetails = await OtherDetailMaster.findAll({ raw: true, transaction });
			const allAtttributeOptionData: Array<{ attribute_id: string; name: string; option_id: string; optionname: string }> =
				await sequelizeConnection.query(
					`SELECT
                    ATTRIBUTESOPTIONS.attribute_id,
                    ATTRIBUTES.name,
                    ATTRIBUTESOPTIONS.option_id,
                    OPTIONS.name as optionname
                FROM attribute_options as  ATTRIBUTESOPTIONS
                left join attributes as ATTRIBUTES on ATTRIBUTES.id = ATTRIBUTESOPTIONS.attribute_id
                left join options as OPTIONS on OPTIONS.id = ATTRIBUTESOPTIONS.option_id
                WHERE ATTRIBUTES.is_deleted = false`,
					{ type: QueryTypes.SELECT, transaction }
				);

			let allSubCategoryAttributesData = await SubCategoryAttributes.findAll({
				attributes: ["sub_category_id", "attribute_id"],
				transaction,
				raw: true,
			});

			let newProductData: Array<ProductDTO> = [];
			let i = 4;
			for await (const product of productSheetData) {
				let productErrorArr = [];
				let attributeOptionData: Array<{ attribute_id: string; option_id: string }> = [];
				let otherDetailData: Array<{ other_detail_id: string; detail_value: number }> = [];

				let findSubCategory: SubcategoryAttribute | undefined | null;
				if (product.sub_category) {
					findSubCategory = allSubCategory.find((row) => row.name.toString().toLowerCase() == product.sub_category.toString().toLowerCase());
					if (findSubCategory == null) {
						productErrorArr.push({ [product.sub_category]: "Sub Category not found" });
					}
				} else {
					productErrorArr.push({ ["sub_category"]: "Sub Category is required" });
				}

				if (!product.name) productErrorArr.push({ ["name"]: "Name is required" });

				const numberValidationCheck = (data: number, name: string) => {
					if (typeof data === "number") {
						if (data < 0) productErrorArr.push({ [name]: "Should not Negative" });
					} else if (typeof data === "undefined" || data == "") productErrorArr.push({ [name]: `${name} is required` });
					else productErrorArr.push({ [name]: "Should be Number" });
				};
				const otherDetailIdCheck = (detail_value: number, detail_name: string) => {
					const findDetail = allOtherDetails.find((row) => row.detail_name == detail_name);
					if (findDetail == null) {
						productErrorArr.push({ [detail_name]: `${detail_name} not found in other details` });
					} else {
						otherDetailData.push({ other_detail_id: findDetail.id, detail_value: detail_value });
					}
				};
				const attributeOptionCheck = (option_value: string, attribute_name: string) => {
					let value = allAtttributeOptionData.find(
						(row) =>
							row.name == attribute_name &&
							row.optionname.toString().replace("_", " ").toLowerCase() == option_value.toString().replace("_", " ").toLowerCase()
					);
					if (value == null) {
						productErrorArr.push({ [option_value]: `${option_value} not found in ${attribute_name}` });
					} else {
						const checkSubCategoryAttributeExists = allSubCategoryAttributesData.find(
							(row) => row.sub_category_id == findSubCategory?.id && row.attribute_id == value.attribute_id
						);

						if (checkSubCategoryAttributeExists) attributeOptionData.push({ attribute_id: value.attribute_id, option_id: value.option_id });
					}
				};

				if (product.br_nk_jewelry_size) {
					if (!(product.br_nk_jewelry_size >= 0.1 && product.br_nk_jewelry_size <= 200)) {
						productErrorArr.push({ [product.br_nk_jewelry_size]: "Bracelet Necklace Jewelry Size should be between 0.10 and 200" });
					}
				}

				if (product.style) {
					if (styleMasterJsonData.findIndex((row) => row.name.toString().toLowerCase() == product.style.toString().toLowerCase()) == -1) {
						productErrorArr.push({ [product.style]: "Style not found in style master" });
					}
				}
				if (product.setting_type) {
					if (styleMasterJsonData.findIndex((row) => row.name.toString().toLowerCase() == product.setting_type.toString().toLowerCase()) == -1) {
						productErrorArr.push({ [product.setting_type]: "Setting Type not found in style master" });
					}
				}
				if (product.sub_setting) {
					if (styleMasterJsonData.findIndex((row) => row.name.toString().toLowerCase() == product.sub_setting.toString().toLowerCase()) == -1) {
						productErrorArr.push({ [product.sub_setting]: "Sub Setting not found in style master" });
					}
				}

				let fields_to_check_attributes = [
					"rn_jewelry_size",
					"er_pn_jewelry_size",
					"p_stone_type",
					"p_stone_certificate",
					"p_stone_name",
					"p_shape",
					"p_color",
					"p_clarity",
					"sd1_stone_type",
					"sd1_stone_certificate",
					"sd1_stone_name",
					"sd1_shape",
					"sd1_color",
					"sd1_clarity",
					"sd2_stone_type",
					"sd2_stone_certificate",
					"sd2_stone_name",
					"sd2_shape",
					"sd2_color",
					"sd2_clarity",
					"o_stone_type",
					"o_stone_certificate",
					"o_stone_name",
					"o_shape",
					"o_color",
					"o_clarity",
				];
				fields_to_check_attributes.forEach((attribute) => {
					if (product[attribute]) {
						attributeOptionCheck(product[attribute], attribute);
					}
				});

				let whiteDiamondColor = ["d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
				let otherColor = ["fancy deep", "fancy vivid", "fancy intense", "fancy dark", "fancy", "fancy light", "light", "very light", "faint"];
				if (product.p_stone_name && product.p_color) {
					if (product.p_stone_name.toString().replace("_", " ").toLowerCase() == "white diamond") {
						if (!whiteDiamondColor.includes(product.p_color.toString().toLowerCase())) {
							productErrorArr.push({ ["p_color_match"]: `Primary Diamond Color should be ${whiteDiamondColor.join(", ")}` });
						}
					} else {
						if (!otherColor.includes(product.p_color.toString().replace("_", " ").toLowerCase())) {
							productErrorArr.push({ ["p_color_match"]: `Primary Diamond Color should be ${otherColor.join(", ")}` });
						}
					}
				}
				if (product.sd1_stone_name && product.sd1_color) {
					if (product.sd1_stone_name.toString().replace("_", " ").toLowerCase() == "white diamond") {
						if (!whiteDiamondColor.includes(product.sd1_color.toString().toLowerCase())) {
							productErrorArr.push({ ["sd1_color_match"]: `Side Diamond 1 Color should be ${whiteDiamondColor.join(", ")}` });
						}
					} else {
						if (!otherColor.includes(product.sd1_color.toString().replace("_", " ").toLowerCase())) {
							productErrorArr.push({ ["sd1_color_match"]: `Side Diamond 1 Color should be ${otherColor.join(", ")}` });
						}
					}
				}
				if (product.sd2_stone_name && product.sd2_color) {
					if (product.sd2_stone_name.toString().replace("_", " ").toLowerCase() == "white diamond") {
						if (!whiteDiamondColor.includes(product.sd2_color.toString().toLowerCase())) {
							productErrorArr.push({ ["sd2_color_match"]: `Side Diamond 2 Color should be ${whiteDiamondColor.join(", ")}` });
						}
					} else {
						if (!otherColor.includes(product.sd2_color.toString().replace("_", " ").toLowerCase())) {
							productErrorArr.push({ ["sd2_color_match"]: `Side Diamond 2 Color should be ${otherColor.join(", ")}` });
						}
					}
				}

				if (product.o_stone_name && product.o_color) {
					if (product.o_stone_name.toString().replace("_", " ").toLowerCase() == "white diamond") {
						if (!whiteDiamondColor.includes(product.o_color.toString().toLowerCase())) {
							productErrorArr.push({ ["o_color_match"]: `Other Diamond Color should be ${whiteDiamondColor.join(", ")}` });
						}
					} else {
						if (!otherColor.includes(product.o_color.toString().replace("_", " ").toLowerCase())) {
							productErrorArr.push({ ["o_color_match"]: `Other Diamond Color should be ${otherColor.join(", ")}` });
						}
					}
				}

				if (product.m950) numberValidationCheck(product.m950, "m950");
				if (product.m18k) numberValidationCheck(product.m18k, "m18k");
				if (product.m14k) numberValidationCheck(product.m14k, "m14k");
				if (product.m10k) numberValidationCheck(product.m10k, "m10k");
				if (product.m925) numberValidationCheck(product.m925, "m925");

				let gold_metal = allAtttributeOptionData.find((row) => row.name == "metal" && row.optionname == "gold");
				if (gold_metal == null) {
					productErrorArr.push({ ["gold_metal"]: "Gold Metal not found in attribute" });
				} else {
					attributeOptionData.push({ attribute_id: gold_metal.attribute_id, option_id: gold_metal.option_id });
				}
				let purity_18k = allAtttributeOptionData.find((row) => row.name == "metal_purity" && row.optionname == "18k");
				if (purity_18k == null) {
					productErrorArr.push({ ["purity_18k"]: "18k purity not found in attribute" });
				} else {
					attributeOptionData.push({ attribute_id: purity_18k.attribute_id, option_id: purity_18k.option_id });
				}
				let color_yellow = allAtttributeOptionData.find((row) => row.name == "metal_color" && row.optionname == "yellow");
				if (color_yellow == null) {
					productErrorArr.push({ ["color_yellow"]: "Yellow color not found in attribute" });
				} else {
					attributeOptionData.push({ attribute_id: color_yellow.attribute_id, option_id: color_yellow.option_id });
				}

				let fields_to_check_other_details = [
					"length",
					"width",
					"thickness",
					"p_mm_size",
					"p_piece",
					"p_carat",
					"sd1_mm_size",
					"sd1_piece",
					"sd1_carat",
					"sd2_mm_size",
					"sd2_piece",
					"sd2_carat",
					"o_mm_size",
					"o_piece",
					"o_carat",
				];

				if (
					findSubCategory &&
					(findSubCategory.name.toString().toLowerCase() == "bracelet" || findSubCategory.name.toString().toLowerCase() == "necklace")
				) {
					const findDetail = allOtherDetails.find((row) => row.detail_name == "br_nk_jewelry_size");
					if (findDetail == null) {
						productErrorArr.push({ ["br_nk_jewelry_size"]: `br_nk_jewelry_size not found in other details` });
					} else {
						otherDetailData.push({ other_detail_id: findDetail.id, detail_value: product.br_nk_jewelry_size });
					}
				}

				fields_to_check_other_details.forEach((otherDetail) => {
					if (product[otherDetail]) {
						numberValidationCheck(product[otherDetail], otherDetail);
						otherDetailIdCheck(product[otherDetail], otherDetail);
					}
				});

				let newProduct = new ProductDTO({
					stock_id: product.stock_id,
					sub_category_id: findSubCategory?.id,
					name: product.name || "",
					description: product.description,
					metal_type: product.metal_type,
					style: product.style,
					setting_type: product.setting_type,
					sub_setting: product.sub_setting,
					prong_type: product.prong_type,
					shank_type: product.shank_type,
					band_type: product.band_type,
					fit_type: product.fit_type,
					lock_type: product.lock_type,
					bail_type: product.bail_type,
					loggedInUserId,
					attributeOptions: attributeOptionData,
					otherDetails: otherDetailData,
				});

				newProductData.push({ ...newProduct, catelog_master: product.catalogue_name?.toString().toLowerCase() });

				for (const error1 of productErrorArr) {
					if (!error.product[i]) error.product[i] = [error1];
					else error.product[i].push(error1);
				}
				i++;
			}
			if (Object.keys(error.product).length === 0) {
				for await (const productData of newProductData) {
					const oldProductData = allProducts.find((row) => row.stock_id.toLowerCase() == productData.stock_id.toLowerCase());

					if (oldProductData == null) {
						await Products.create(productData, { transaction }).then(async (newProductData) => {
							if (productData.catelog_master) {
								const findCatalogExists = await CatalogMaster.findOne({ where: { name: productData.catelog_master }, raw: true, transaction });
								if (findCatalogExists != null) {
									await CatalogProducts.create(
										{
											catalog_id: findCatalogExists.id,
											product_id: newProductData.id,
											last_updated_by: productData.last_updated_by,
										},
										{ transaction }
									);
								} else {
									let newCatalogData: CreateCatalogDTO = {
										name: productData.catelog_master,
										catalog_products: [newProductData.id],
										last_updated_by: productData.last_updated_by,
									};
									await CatalogMaster.create(newCatalogData, { transaction }).then(async (data) => {
										let catPro = newCatalogData.catalog_products.map((product_id) => {
											return {
												catalog_id: data.id,
												product_id,
												last_updated_by: newCatalogData.last_updated_by,
											};
										});

										await CatalogProducts.bulkCreate(catPro, { ignoreDuplicates: true, transaction });
									});
								}
							}

							let productAttributeOption1 = productData.attributeOptions.map((data) => {
								return { ...data, product_id: newProductData.id };
							});
							await ProductAttributeOptions.bulkCreate(productAttributeOption1, { ignoreDuplicates: true, transaction });

							let productOtherDetails = productData.otherDetails.map((data) => {
								return { ...data, product_id: newProductData.id };
							});
							await ProductOtherDetail.bulkCreate(productOtherDetails, { ignoreDuplicates: true, transaction });
						});
					} else {
						await Products.update(productData, { where: { id: oldProductData.id }, transaction });
						await ProductAttributeOptions.destroy({ where: { product_id: oldProductData.id }, transaction });
						await ProductOtherDetail.destroy({ where: { product_id: oldProductData.id }, transaction });

						if (productData.catelog_master) {
							const findCatalogExists = await CatalogMaster.findOne({ where: { name: productData.catelog_master }, raw: true, transaction });
							if (findCatalogExists != null) {
								await CatalogProducts.destroy({ where: { catalog_id: findCatalogExists.id, product_id: oldProductData.id }, transaction });
								await CatalogProducts.create(
									{
										catalog_id: findCatalogExists.id,
										product_id: oldProductData.id,
										last_updated_by: productData.last_updated_by,
									},
									{ transaction }
								);
							} else {
								let newCatalogData: CreateCatalogDTO = {
									name: productData.catelog_master,
									catalog_products: [oldProductData.id],
									last_updated_by: productData.last_updated_by,
								};
								await CatalogMaster.create(newCatalogData, { transaction }).then(async (data) => {
									let catPro = newCatalogData.catalog_products.map((product_id) => {
										return {
											catalog_id: data.id,
											product_id,
											last_updated_by: newCatalogData.last_updated_by,
										};
									});

									await CatalogProducts.bulkCreate(catPro, { ignoreDuplicates: true, transaction });
								});
							}
						}

						let productAttributeOption1 = productData.attributeOptions.map((data) => {
							return { ...data, product_id: oldProductData.id };
						});
						await ProductAttributeOptions.bulkCreate(productAttributeOption1, { ignoreDuplicates: true, transaction });

						let productOtherDetails = productData.otherDetails.map((data) => {
							return { ...data, product_id: oldProductData.id };
						});
						await ProductOtherDetail.bulkCreate(productOtherDetails, { ignoreDuplicates: true, transaction });
					}
				}
				return "Product Bulk uploaded successfully";
			}
			throw new BadResponseHandler(error);
		});
	};
}
