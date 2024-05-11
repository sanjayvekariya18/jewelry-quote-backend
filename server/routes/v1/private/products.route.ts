import { Router } from "express";
import { use } from "../../../errorHandler";
import { ProductController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";

const router = Router();
const controller = new ProductController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/", basicValidatorHandler.handler(controller.getAll.validation), use(controller.getAll.controller));
router.get("/product-images/:stock_id", use(controller.getFilesByProductStockId.controller));
router.get("/:id", use(controller.findOne.controller));
router.post("/", basicValidatorHandler.handler(controller.create.validation), use(controller.create.controller));
router.post("/bulk", use(controller.bulkCreateExcel.controller));
router.put("/:id", basicValidatorHandler.handler(controller.edit.validation), use(controller.edit.controller));
router.put("/toggle-product-active/:id", use(controller.toggleProductActive.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
