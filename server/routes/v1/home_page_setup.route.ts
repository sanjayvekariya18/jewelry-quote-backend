import { Router } from "express";
import { HomePageSetupController } from "../../controller";
import { use } from "../../errorHandler";

const router = Router();
const controller = new HomePageSetupController();

router.get("/:section", use(controller.findOne.controller));
router.get("/", use(controller.getAll.controller));

export default router;
