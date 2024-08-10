import { Router } from "express";
import { use } from "../../../errorHandler";
import { EnquiryNowController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new EnquiryNowController();
const basicValidatorHandler = new BasicValidatorHandler();

router.post("/", basicValidatorHandler.handler(controller.create.validation), use(controller.create.controller));

export default router;
