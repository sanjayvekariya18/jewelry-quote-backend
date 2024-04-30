import { Router } from "express";
import categoryRoutes from "./category.route";
import subCategoryRoutes from "./subCategory.route";
import userMasterRoutes from "./userMaster.route";
import userPermissionRoutes from "./userPermissions.route";
import permissionMasterRoutes from "./permissionMaster.route";
import customerDetailsRoutes from "./customerDetails.route";
import productsRoutes from "./products.route";
import catalogRoutes from "./catalog.route";
import listRoutes from "./../list.route";
import attributeRoutes from "./attributes.route";
import optionRoutes from "./options.route";
import quotationRoutes from "./quotation.route";
import { AuthorizationController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";
import { use } from "../../../errorHandler";
import { UserPermissionsCheck } from "../../../middlewares";
import { PERMISSIONS } from "../../../enum";

const router = Router();
const authorizationController = new AuthorizationController();
const basicValidatorHandler = new BasicValidatorHandler();

router.post("/login", basicValidatorHandler.handler(authorizationController.login.validation), use(authorizationController.login.controller));
router.use("/category", UserPermissionsCheck(PERMISSIONS.CATEGORY), categoryRoutes);
router.use("/sub-category", UserPermissionsCheck(PERMISSIONS.SUB_CATEGORY), subCategoryRoutes);
router.use("/user-master", UserPermissionsCheck(PERMISSIONS.USERS), userMasterRoutes);
router.use("/user-permission", UserPermissionsCheck(PERMISSIONS.USER_PERMISSIONS), userPermissionRoutes);
router.use("/permissions", UserPermissionsCheck(PERMISSIONS.USER_PERMISSIONS), permissionMasterRoutes);
router.use("/customer-details", UserPermissionsCheck(PERMISSIONS.CUSTOMER), customerDetailsRoutes);
router.use("/products", UserPermissionsCheck(PERMISSIONS.PRODUCT), productsRoutes);
router.use("/catalog-master", UserPermissionsCheck(PERMISSIONS.CATALOG_MASTER), catalogRoutes);
router.use("/attributes", UserPermissionsCheck(PERMISSIONS.ATTRIBUTES), attributeRoutes);
router.use("/options", UserPermissionsCheck(PERMISSIONS.OPTIONS), optionRoutes);
router.use("/quotation", UserPermissionsCheck(PERMISSIONS.QUOTATION), quotationRoutes);
router.use("/list", listRoutes);

export default router;
