import { Router } from "express";
import { use } from "../../../errorHandler";
import { QuotationController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new QuotationController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", basicValidatorHandler.handler(controller.getAllForCustomer.validation), use(controller.getAllForCustomer.controller));
router.get("/:id", use(controller.findOne.controller));

router.post("/", use(controller.placeQuotation.controller));

export default router;
