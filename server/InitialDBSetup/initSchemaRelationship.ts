import { Category, SubCategory, UserMaster } from "../models";

const initSchemaRelationship = () => {
	// User
	UserMaster.hasOne(UserMaster, { sourceKey: "last_updated_by", foreignKey: "id" });

	// Category
	Category.hasOne(UserMaster, { sourceKey: "last_updated_by", foreignKey: "id" });
	Category.hasMany(SubCategory, { sourceKey: "id", foreignKey: "category_id" });

	// Sub Category
	SubCategory.hasOne(Category, { sourceKey: "category_id", foreignKey: "id" });
	SubCategory.hasOne(UserMaster, { sourceKey: "last_updated_by", foreignKey: "id" });
};

export default initSchemaRelationship;
