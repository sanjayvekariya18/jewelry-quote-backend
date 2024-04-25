import { BulkCreateWishlistDTO } from "../dto";
import { Products, WishList } from "../models";

export default class WishListServices {
	public getAll = async (loggedInUserId: string) => {
		return await WishList.findAll({
			where: { customer_id: loggedInUserId },
			include: [
				{
					model: Products,
					// attributes: [],
				},
			],
			attributes: ["id", "customer_id", "product_id"],
		});
	};

	public findAll = async (searchParams?: any) => {
		return await WishList.findAll({
			where: searchParams,
			attributes: ["wishlist_id", "customer_id", "product_id"],
			order: [["createdAt", "DESC"]],
		});
	};

	public findOne = async (searchObject: any) => {
		return await WishList.findOne({
			where: searchObject,
			attributes: ["wishlist_id", "customer_id", "product_id"],
		});
	};

	public bulkCreate = async (wishlistData: BulkCreateWishlistDTO) => {
		return await WishList.bulkCreate(wishlistData.wishlist, { returning: true });
	};

	public toggle = async (loggedInUserId: string, productId: string) => {
		const productData = await WishList.findOne({ where: { customer_id: loggedInUserId, product_id: productId } });
		if (productData && productData != null) {
			return this.delete(productData.id);
		} else {
			return await WishList.create({ customer_id: loggedInUserId, product_id: productId });
		}
	};

	public delete = async (wishListId: string) => {
		return await WishList.destroy({ where: { id: wishListId } });
	};
}
