import { Router } from "express";
import { use } from "../../../errorHandler";
import { CategoryController, EnquiryNowController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new EnquiryNowController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", basicValidatorHandler.handler(controller.getAll.validation), use(controller.getAll.controller));
router.post("/", basicValidatorHandler.handler(controller.create.validation), use(controller.create.controller));
router.put("/toggle-is-read/:id", use(controller.toggleEnquiryIsRead.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
