import { Router } from "express";
import { use } from "../../../errorHandler";
import { ProductController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const basicValidatorHandler = new BasicValidatorHandler();
const controller = new ProductController();

router.get("/", basicValidatorHandler.handler(controller.getAllForCustomer.validation), use(controller.getAllForCustomer.controller));
router.get("/:id", use(controller.findOne.controller));

export default router;
