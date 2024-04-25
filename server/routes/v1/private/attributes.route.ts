import { Router } from "express";
import { requestValidate } from "../../../utils/helper";
import { AttributesController } from "../../../controller";
import { use } from "../../../errorHandler";
const router = Router();
const attributesController = new AttributesController();

router.get("/", use(attributesController.getAll.controller));
router.get("/:id", use(attributesController.findOne.controller));
router.post("/", requestValidate(attributesController.create.validation), use(attributesController.create.controller));
router.put("/:id", requestValidate(attributesController.edit.validation), use(attributesController.edit.controller));
// router.delete("/:id", use(attributesController.delete.controller));

export default router;
