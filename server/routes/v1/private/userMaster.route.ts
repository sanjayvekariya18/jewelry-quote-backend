import { Router } from "express";
import { use } from "../../../errorHandler";
import { UserMasterController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new UserMasterController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", use(controller.getAll.controller));
router.get("/:id", use(controller.findOne.controller));
router.post("/", basicValidatorHandler.handler(controller.create.validation), use(controller.create.controller));
router.put("/change-password", basicValidatorHandler.handler(controller.changePassword.validation), use(controller.changePassword.controller));
router.put("/:id", basicValidatorHandler.handler(controller.edit.validation), use(controller.edit.controller));
router.put("/toggle-user-active/:id", use(controller.toggleUserActive.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
