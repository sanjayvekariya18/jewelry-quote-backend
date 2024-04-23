export class CreateWishlistDTO {
	product_id: string;
	customer_id: string;

	constructor(data: any) {
		this.product_id = data.product_id;
		this.customer_id = data.loggedInUserId;
	}
}

export class BulkCreateWishlistDTO {
	wishlist: Array<CreateWishlistDTO> = [];

	constructor(data: any) {
		data.wishlistData.forEach((list: CreateWishlistDTO) => {
			this.wishlist.push(new CreateWishlistDTO({ ...list, loggedInUserId: data.loggedInUserId }));
		});
	}
}
