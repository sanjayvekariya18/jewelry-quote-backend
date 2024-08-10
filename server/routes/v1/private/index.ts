import { Router } from "express";
import categoryRoutes from "./category.route";
import subCategoryRoutes from "./subCategory.route";
import userMasterRoutes from "./userMaster.route";
import userPermissionRoutes from "./userPermissions.route";
import customerDetailsRoutes from "./customerDetails.route";
import productsRoutes from "./products.route";
import catalogRoutes from "./catalog.route";
import listRoutes from "./../list.route";
import attributeRoutes from "./attributes.route";
import optionRoutes from "./options.route";
import quotationRoutes from "./quotation.route";
import styleMasterRoutes from "./styleMaster.route";
import otherDetailMasterRoutes from "./otherDetailMaster.route";
import dashboardRoutes from "./dashboard.route";
import homePageSetupRoutes from "./home_page_setup.route";
import emailSubscribedRoutes from "./emailSubscribed.route";
import enquiryNowRoutes from "./enquiry.route";
import { AuthorizationController, ForgotPasswordController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";
import { use } from "../../../errorHandler";
import { forgotPasswordUserType, UserPermissionsCheck } from "../../../middlewares";
import { FORGOT_PASSWORD_USER_TYPE, PERMISSIONS } from "../../../enum";

const router = Router();
const authorizationController = new AuthorizationController();
const basicValidatorHandler = new BasicValidatorHandler();
const forgotPasswordController = new ForgotPasswordController();

router.post("/login", basicValidatorHandler.handler(authorizationController.login.validation), use(authorizationController.login.controller));
router.post(
	"/forgot-password",
	forgotPasswordUserType(FORGOT_PASSWORD_USER_TYPE.ADMIN),
	basicValidatorHandler.handler(forgotPasswordController.forgotPassword.validation),
	use(forgotPasswordController.forgotPassword.controller)
);

router.use("/category", UserPermissionsCheck(PERMISSIONS.CATEGORY), categoryRoutes);
router.use("/sub-category", UserPermissionsCheck(PERMISSIONS.SUB_CATEGORY), subCategoryRoutes);
router.use("/user-master", userMasterRoutes);
router.use("/user-permission", UserPermissionsCheck(PERMISSIONS.USER_PERMISSIONS), userPermissionRoutes);
// router.use("/permissions", UserPermissionsCheck(PERMISSIONS.USER_PERMISSIONS), permissionMasterRoutes);
router.use("/customer-details", UserPermissionsCheck(PERMISSIONS.CUSTOMER), customerDetailsRoutes);
router.use("/products", UserPermissionsCheck(PERMISSIONS.PRODUCT), productsRoutes);
router.use("/catalog-master", UserPermissionsCheck(PERMISSIONS.CATALOG_MASTER), catalogRoutes);
router.use("/attributes", UserPermissionsCheck(PERMISSIONS.ATTRIBUTES), attributeRoutes);
router.use("/options", UserPermissionsCheck(PERMISSIONS.OPTIONS), optionRoutes);
router.use("/quotation", UserPermissionsCheck(PERMISSIONS.QUOTATION), quotationRoutes);
router.use("/style-master", UserPermissionsCheck(PERMISSIONS.STYLE_MASTER), styleMasterRoutes);
router.use("/other-details", otherDetailMasterRoutes);
router.use("/dashboard", UserPermissionsCheck(PERMISSIONS.DASHBOARD), dashboardRoutes);
router.use("/home-page-setup", UserPermissionsCheck(PERMISSIONS.HOME_PAGE_SETUP), homePageSetupRoutes);
router.use("/email-subscribed", UserPermissionsCheck(PERMISSIONS.EMAIL_SUBSCRIBED), emailSubscribedRoutes);
router.use("/email-subscribed", UserPermissionsCheck(PERMISSIONS.EMAIL_SUBSCRIBED), emailSubscribedRoutes);
router.use("/enquiry-now", UserPermissionsCheck(PERMISSIONS.ENQUIRY_NOW), enquiryNowRoutes);

router.use("/list", listRoutes);

export default router;
