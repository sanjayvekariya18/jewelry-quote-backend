import { Router } from "express";
import { UserPermissionController } from "../../../controller";
import { use } from "../../../errorHandler";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const userPermissionController = new UserPermissionController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/:id", use(userPermissionController.getAll.controller));
router.get("/:id/not", use(userPermissionController.permissionsNotAssigned.controller));
router.post("/", basicValidatorHandler.handler(userPermissionController.create.validation), use(userPermissionController.create.controller));

router.put(
	"/:id/toggle",
	basicValidatorHandler.handler(userPermissionController.toggleUserPermission.validation),
	use(userPermissionController.toggleUserPermission.controller)
);

router.delete("/:id", use(userPermissionController.delete.controller));

export default router;
