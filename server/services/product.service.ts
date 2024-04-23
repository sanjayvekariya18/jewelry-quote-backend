import { Op } from "sequelize";
import { Products, SubCategory } from "../models";
import { CreateProductDTO, EditProductDTO, SearchProductDTO } from "../dto";
import { sequelizeConnection } from "../config/database";

export default class ProductService {
	private Sequelize = sequelizeConnection.Sequelize;

	public getAll = async (searchParams: SearchProductDTO) => {
		return await Products.findAndCountAll({
			where: {
				...(searchParams.searchTxt && {
					name: {
						[Op.like]: "%" + searchParams.searchTxt + "%",
					},
				}),
				...(searchParams.sub_category_id && {
					sub_category_id: searchParams.sub_category_id,
				}),
				is_deleted: false,
			},

			include: [
				{
					model: SubCategory,
					attributes: [],
				},
			],
			order: [["name", "ASC"]],
			// attributes: ["id", "sub_category_id", [this.Sequelize.col("SubCategory.name"), "category_name"], "name", "details", "logo_url", "img_url"],
			...(searchParams.page != undefined &&
				searchParams.rowsPerPage != undefined && {
					offset: searchParams.page * searchParams.rowsPerPage,
					limit: searchParams.rowsPerPage,
				}),
		});
	};

	public findOne = async (searchObject: any) => {
		return await Products.findOne({
			where: searchObject,
			// attributes: ["id", "category_id", "name", "details", "logo_url", "img_url"],
		});
	};

	public create = async (productData: CreateProductDTO) => {
		return await Products.create(productData).then(() => {
			return "Product Created Successfully";
		});
	};

	public edit = async (product_id: string, productData: EditProductDTO) => {
		return await Products.update(productData, { where: { id: product_id } }).then(() => {
			return "Product Created Successfully";
		});
	};

	public delete = async (product_id: string) => {
		return await Products.update({ is_deleted: true }, { where: { id: product_id } }).then(() => {
			return "Product Deleted Successfully";
		});
	};
}
