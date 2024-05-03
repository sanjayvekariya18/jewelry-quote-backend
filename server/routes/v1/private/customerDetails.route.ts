import { Router } from "express";
import { use } from "../../../errorHandler";
import { CustomerDetailsController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new CustomerDetailsController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", basicValidatorHandler.handler(controller.getAll.validation), use(controller.getAll.controller));
router.get("/:id", use(controller.findOne.controller));
router.put("/toggle-customer-active/:id", use(controller.toggleCustomerActive.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
