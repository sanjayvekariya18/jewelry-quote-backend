import { Category, CustomerDetails, PermissionMaster, Products, SubCategory, UserMaster, UserPermissions, WishList } from "../models";

const initSchemaRelationship = () => {
	// User
	// UserMaster.hasOne(UserMaster, { sourceKey: "last_updated_by", foreignKey: "id" });
	UserMaster.hasOne(UserPermissions, { sourceKey: "id", foreignKey: "user_id" });

	// UserPermission
	// UserPermissions.hasOne(UserMaster, { sourceKey: "last_updated_by", foreignKey: "id" });
	UserPermissions.hasOne(UserMaster, { sourceKey: "user_id", foreignKey: "id" });
	UserPermissions.hasOne(PermissionMaster, { sourceKey: "permission_master_id", foreignKey: "id" });

	// Category
	// Category.hasOne(UserMaster, { sourceKey: "last_updated_by", foreignKey: "id" });
	Category.hasMany(SubCategory, { sourceKey: "id", foreignKey: "category_id" });

	// Sub Category
	SubCategory.hasOne(Category, { sourceKey: "category_id", foreignKey: "id" });
	// SubCategory.hasOne(UserMaster, { sourceKey: "last_updated_by", foreignKey: "id" });
	SubCategory.hasMany(Products, { sourceKey: "id", foreignKey: "sub_category_id" });

	// PermissionMaster
	PermissionMaster.hasMany(UserPermissions, { sourceKey: "id", foreignKey: "permission_master_id" });

	// Products
	Products.hasOne(SubCategory, { sourceKey: "sub_category_id", foreignKey: "id" });
	Products.hasMany(WishList, { sourceKey: "id", foreignKey: "product_id" });

	// Wishlist
	WishList.hasOne(Products, { sourceKey: "product_id", foreignKey: "id" });
	WishList.hasOne(CustomerDetails, { sourceKey: "customer_id", foreignKey: "id" });
};

export default initSchemaRelationship;
