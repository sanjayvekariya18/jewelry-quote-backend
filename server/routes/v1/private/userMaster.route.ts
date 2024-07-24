import { Router } from "express";
import { use } from "../../../errorHandler";
import { UserMasterController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";
import { PERMISSIONS } from "../../../enum";
import { UserPermissionsCheck } from "../../../middlewares";

const router = Router();
const controller = new UserMasterController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get(
	"/",
	UserPermissionsCheck(PERMISSIONS.USERS),
	basicValidatorHandler.handler(controller.getAll.validation),
	use(controller.getAll.controller)
);
router.get("/:id", UserPermissionsCheck(PERMISSIONS.USERS), use(controller.findOne.controller));
router.post(
	"/",
	UserPermissionsCheck(PERMISSIONS.USERS),
	basicValidatorHandler.handler(controller.create.validation),
	use(controller.create.controller)
);
router.put("/change-password", basicValidatorHandler.handler(controller.changePassword.validation), use(controller.changePassword.controller));
router.put(
	"/:id",
	UserPermissionsCheck(PERMISSIONS.USERS),
	basicValidatorHandler.handler(controller.edit.validation),
	use(controller.edit.controller)
);
router.put("/toggle-user-active/:id", UserPermissionsCheck(PERMISSIONS.USERS), use(controller.toggleUserActive.controller));
router.delete("/:id", UserPermissionsCheck(PERMISSIONS.USERS), use(controller.delete.controller));

export default router;
