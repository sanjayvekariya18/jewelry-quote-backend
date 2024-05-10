import { Router } from "express";
import { use } from "../../../errorHandler";
import { CatalogController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new CatalogController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", basicValidatorHandler.handler(controller.getAllForCustomer.validation), use(controller.getAllForCustomer.controller));
router.get("/:id", use(controller.findOneForCustomer.controller));

export default router;
