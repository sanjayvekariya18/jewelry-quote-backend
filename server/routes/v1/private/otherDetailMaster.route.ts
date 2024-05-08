import { Router } from "express";
import { use } from "../../../errorHandler";
import { OtherDetailMasterController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new OtherDetailMasterController();

router.get("/", use(controller.getAll.controller));
router.get("/:id", use(controller.findOne.controller));

export default router;
