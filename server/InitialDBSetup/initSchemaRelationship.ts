import { Category, PermissionMaster, SubCategory, UserMaster, UserPermissions } from "../models";

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

	// PermissionMaster
	PermissionMaster.hasMany(UserPermissions, { sourceKey: "id", foreignKey: "permission_master_id" });
};

export default initSchemaRelationship;
