import { Router } from "express";
import { use } from "../../../errorHandler";
import { DashboardController } from "../../../controller";

const router = Router();
const controller = new DashboardController();

router.get("/total", use(controller.getTotalData.controller));

export default router;
