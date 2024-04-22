import { Router } from "express";
import categoryRoutes from "./category.route";
import subCategoryRoutes from "./subCategory.route";
import userMasterRoutes from "./userMaster.route";
import { AuthorizationController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";
import { use } from "../../../errorHandler";

const router = Router();
const authorizationController = new AuthorizationController();
const basicValidatorHandler = new BasicValidatorHandler();

router.post("/login", basicValidatorHandler.handler(authorizationController.login.validation), use(authorizationController.login.controller));
router.use(
	"/category",
	// UserPermissionsCheck(PERMISSIONS.BLOG_CATEGORIES),
	categoryRoutes
);
router.use(
	"/sub-category",
	// UserPermissionsCheck(PERMISSIONS.BLOG_CATEGORIES),
	subCategoryRoutes
);
router.use(
	"/user-master",
	// UserPermissionsCheck(PERMISSIONS.BLOG_CATEGORIES),
	userMasterRoutes
);

export default router;
