import { Router } from "express";
import { use } from "../../../errorHandler";
import { CatalogController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new CatalogController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", basicValidatorHandler.handler(controller.getAll.validation), use(controller.getAll.controller));
router.get("/:id", use(controller.findOne.controller));
router.post("/", basicValidatorHandler.handler(controller.create.validation), use(controller.create.controller));
router.put("/:id", basicValidatorHandler.handler(controller.edit.validation), use(controller.edit.controller));
router.put("/toggle-catalog-active/:id", use(controller.toggleCatalogActive.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
