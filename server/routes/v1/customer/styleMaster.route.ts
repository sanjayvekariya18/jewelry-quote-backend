import { Router } from "express";
import { StyleMasterController } from "../../../controller";
import { use } from "../../../errorHandler";

const router = Router();
const controller = new StyleMasterController();

router.get("/", use(controller.getMenu.controller));
router.get("/sub-category/:id", use(controller.getStyleAsPerSubCategoryId.controller));

export default router;
