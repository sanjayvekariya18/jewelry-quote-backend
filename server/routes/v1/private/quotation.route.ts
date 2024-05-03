import { Router } from "express";
import { use } from "../../../errorHandler";
import { QuotationController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new QuotationController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", basicValidatorHandler.handler(controller.getAll.validation), use(controller.getAll.controller));
router.get("/:id", use(controller.findOne.controller));
router.post("/", basicValidatorHandler.handler(controller.placeQuotation.validation), use(controller.placeQuotation.controller));
router.put("/status/:id", basicValidatorHandler.handler(controller.changeStatus.validation), use(controller.changeStatus.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
