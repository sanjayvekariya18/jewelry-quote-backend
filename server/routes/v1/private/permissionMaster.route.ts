import { Router } from "express";
import { PermissionMasterController } from "../../../controller";
import { use } from "../../../errorHandler";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const permissionMasterController = new PermissionMasterController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", use(permissionMasterController.getAll.controller));
router.post("/", basicValidatorHandler.handler(permissionMasterController.create.validation), use(permissionMasterController.create.controller));

export default router;
