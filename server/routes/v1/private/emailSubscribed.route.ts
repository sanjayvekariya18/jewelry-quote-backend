import { Router } from "express";
import { use } from "../../../errorHandler";
import { EmailSubscribedController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new EmailSubscribedController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", basicValidatorHandler.handler(controller.getAll.validation), use(controller.getAll.controller));
router.get("/:id", use(controller.findOne.controller));
// router.post("/", basicValidatorHandler.handler(controller.create.validation), use(controller.create.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
