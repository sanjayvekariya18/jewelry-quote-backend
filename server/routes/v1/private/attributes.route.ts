import { Router } from "express";
import { AttributesController } from "../../../controller";
import { use } from "../../../errorHandler";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";
const router = Router();
const attributesController = new AttributesController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", basicValidatorHandler.handler(attributesController.getAll.validation), use(attributesController.getAll.controller));
router.get("/:id", use(attributesController.findOne.controller));
router.post("/", basicValidatorHandler.handler(attributesController.create.validation), use(attributesController.create.controller));
router.put("/:id", basicValidatorHandler.handler(attributesController.edit.validation), use(attributesController.edit.controller));
router.delete("/:id", use(attributesController.delete.controller));

export default router;
