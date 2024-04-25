import {
	Attributes,
	CatalogMaster,
	CatalogProducts,
	Category,
	CustomerDetails,
	Options,
	PermissionMaster,
	ProductAttributeOptions,
	Products,
	SubCategory,
	UserMaster,
	UserPermissions,
	WishList,
} from "../models";

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
	Products.hasMany(ProductAttributeOptions, { sourceKey: "id", foreignKey: "product_id" });

	// Wishlist
	WishList.hasOne(Products, { sourceKey: "product_id", foreignKey: "id" });
	WishList.hasOne(CustomerDetails, { sourceKey: "customer_id", foreignKey: "id" });

	// CatalogMaster
	CatalogMaster.hasMany(CatalogProducts, { sourceKey: "id", foreignKey: "catalog_id" });

	// CatalogProducts
	CatalogProducts.hasOne(CatalogMaster, { sourceKey: "catalog_id", foreignKey: "id" });
	CatalogProducts.hasOne(Products, { sourceKey: "product_id", foreignKey: "id" });

	// Attributes
	Attributes.hasMany(ProductAttributeOptions, { sourceKey: "id", foreignKey: "attribute_id" });

	// Options
	Options.hasMany(ProductAttributeOptions, { sourceKey: "id", foreignKey: "option_id" });

	// ProductAttributeOptions
	ProductAttributeOptions.hasOne(Products, { sourceKey: "product_id", foreignKey: "id" });
	ProductAttributeOptions.hasOne(Attributes, { sourceKey: "attribute_id", foreignKey: "id" });
	// ProductAttributeOptions.hasOne(Options, { sourceKey: "option_id", foreignKey: "id" });
};

export default initSchemaRelationship;
