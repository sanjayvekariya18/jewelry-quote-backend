import { Router } from "express";
import { requestValidate } from "../../../utils/helper";
import { OptionsController } from "../../../controller";
import { use } from "../../../errorHandler";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const optionsMasterController = new OptionsController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", basicValidatorHandler.handler(optionsMasterController.getAll.validation), use(optionsMasterController.getAll.controller));
router.get("/:id", use(optionsMasterController.findOne.controller));
router.post("/", basicValidatorHandler.handler(optionsMasterController.create.validation), use(optionsMasterController.create.controller));
router.put("/:id", requestValidate(optionsMasterController.edit.validation), use(optionsMasterController.edit.controller));
router.delete("/:id", use(optionsMasterController.delete.controller));

export default router;
