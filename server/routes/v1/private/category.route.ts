import { Router } from "express";
import { requestValidate } from "../../../utils/helper";
import { use } from "../../../errorHandler";
import { CategoryController } from "../../../controller";
import { RequestModification } from "../../../middlewares";

const router = Router();
const controller = new CategoryController();

router.get("/", use(controller.getAll.controller));
router.get("/:id", use(controller.getCategoryDetails.controller));
router.post("/", requestValidate(controller.create.validation), use(controller.create.controller));
router.put("/:id", requestValidate(controller.edit.validation), use(controller.edit.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
