import { Router } from "express";
import { AddToQuoteController } from "../../../controller";
import { use } from "../../../errorHandler";
import { requestValidate } from "../../../utils/helper";

const router = Router();
const controller = new AddToQuoteController();

router.get("/", use(controller.getAll.controller));
router.get("/count", use(controller.getATQTotalCount.controller));
router.post("/", requestValidate(controller.create.validation), use(controller.create.controller));
router.put("/:id", requestValidate(controller.edit.validation), use(controller.edit.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
