import { Router } from "express";
import { requestValidate } from "../../../utils/helper";
import { use } from "../../../errorHandler";
import { SubCategoryController } from "../../../controller";

const router = Router();
const controller = new SubCategoryController();

router.get("/", requestValidate(controller.getAll.validation), use(controller.getAll.controller));
router.post("/", requestValidate(controller.create.validation), use(controller.create.controller));
router.put("/:id", requestValidate(controller.edit.validation), use(controller.edit.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
