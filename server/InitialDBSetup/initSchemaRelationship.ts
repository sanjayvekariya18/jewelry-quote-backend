import {
	ATQAttributeOptions,
	AddToQuote,
	Attributes,
	AttributesOptions,
	CatalogMaster,
	CatalogProducts,
	Category,
	CustomerDetails,
	Options,
	PermissionMaster,
	ProductAttributeOptions,
	Products,
	QuotationAttributeOptions,
	QuotationMaster,
	QuotationProduct,
	StyleMaster,
	SubCategory,
	SubCategoryAttributes,
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
	SubCategory.hasMany(SubCategoryAttributes, { sourceKey: "id", foreignKey: "sub_category_id" });
	SubCategory.hasMany(StyleMaster, { sourceKey: "id", foreignKey: "sub_category_id" });

	// PermissionMaster
	PermissionMaster.hasMany(UserPermissions, { sourceKey: "id", foreignKey: "permission_master_id" });

	// Products
	Products.hasOne(SubCategory, { sourceKey: "sub_category_id", foreignKey: "id" });
	Products.hasMany(WishList, { sourceKey: "id", foreignKey: "product_id" });
	Products.hasMany(AddToQuote, { sourceKey: "id", foreignKey: "product_id" });
	Products.hasMany(ProductAttributeOptions, { sourceKey: "id", foreignKey: "product_id" });
	Products.hasMany(QuotationProduct, { sourceKey: "id", foreignKey: "product_id" });

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
	Attributes.hasMany(SubCategoryAttributes, { sourceKey: "id", foreignKey: "attribute_id" });
	Attributes.hasMany(AttributesOptions, { sourceKey: "id", foreignKey: "attribute_id" });
	Attributes.hasMany(ATQAttributeOptions, { sourceKey: "id", foreignKey: "attribute_id" });

	// Options
	Options.hasMany(ProductAttributeOptions, { sourceKey: "id", foreignKey: "option_id" });
	Options.hasMany(AttributesOptions, { sourceKey: "id", foreignKey: "option_id" });
	Options.hasMany(ATQAttributeOptions, { sourceKey: "id", foreignKey: "option_id" });

	AttributesOptions.hasOne(Attributes, { sourceKey: "attribute_id", foreignKey: "id" });
	AttributesOptions.hasOne(Options, { sourceKey: "option_id", foreignKey: "id" });

	// ProductAttributeOptions
	ProductAttributeOptions.hasOne(Products, { sourceKey: "product_id", foreignKey: "id" });
	ProductAttributeOptions.hasOne(Attributes, { sourceKey: "attribute_id", foreignKey: "id" });
	ProductAttributeOptions.hasOne(Options, { sourceKey: "option_id", foreignKey: "id" });

	// SubCateogoryAttributes
	SubCategoryAttributes.hasOne(SubCategory, { sourceKey: "sub_category_id", foreignKey: "id" });
	SubCategoryAttributes.hasOne(Attributes, { sourceKey: "attribute_id", foreignKey: "id" });

	// CustomerDetails
	CustomerDetails.hasMany(WishList, { sourceKey: "id", foreignKey: "customer_id" });
	CustomerDetails.hasMany(AddToQuote, { sourceKey: "id", foreignKey: "customer_id" });
	CustomerDetails.hasMany(QuotationMaster, { sourceKey: "id", foreignKey: "customer_id" });

	// AddToQuote
	AddToQuote.hasMany(ATQAttributeOptions, { sourceKey: "id", foreignKey: "add_to_quote_id" });
	AddToQuote.hasOne(Products, { sourceKey: "product_id", foreignKey: "id" });
	AddToQuote.hasOne(CustomerDetails, { sourceKey: "customer_id", foreignKey: "id" });

	// ATQAttributeOptions
	ATQAttributeOptions.hasOne(AddToQuote, { sourceKey: "add_to_quote_id", foreignKey: "id" });
	ATQAttributeOptions.hasOne(Attributes, { sourceKey: "attribute_id", foreignKey: "id" });
	ATQAttributeOptions.hasOne(Options, { sourceKey: "option_id", foreignKey: "id" });

	// QuotationMaster
	QuotationMaster.hasOne(CustomerDetails, { sourceKey: "customer_id", foreignKey: "id" });
	QuotationMaster.hasMany(QuotationProduct, { sourceKey: "id", foreignKey: "quotation_id" });

	// QuotationProduct
	QuotationProduct.hasMany(QuotationAttributeOptions, { sourceKey: "id", foreignKey: "quotation_product_id" });
	QuotationProduct.hasOne(Products, { sourceKey: "product_id", foreignKey: "id" });
	QuotationProduct.hasOne(QuotationMaster, { sourceKey: "quotation_id", foreignKey: "id" });

	// QuotationAttributeOptions
	QuotationAttributeOptions.hasOne(QuotationProduct, { sourceKey: "quotation_product_id", foreignKey: "id" });

	// StyleMaster
	StyleMaster.hasOne(StyleMaster, { sourceKey: "parent_id", foreignKey: "id", as: "parent_style" });
	StyleMaster.hasOne(SubCategory, { sourceKey: "sub_category_id", foreignKey: "id" });
};

export default initSchemaRelationship;
