import { Router } from "express";
import { use } from "../../../errorHandler";
import { CustomerDetailsController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new CustomerDetailsController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/profile", use(controller.getProfileDetails.controller));
router.put("/", basicValidatorHandler.handler(controller.edit.validation), use(controller.edit.controller));
router.put("/change-password", basicValidatorHandler.handler(controller.changePassword.validation), use(controller.changePassword.controller));

export default router;
