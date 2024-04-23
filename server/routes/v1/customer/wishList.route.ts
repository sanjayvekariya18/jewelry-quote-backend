import { Router } from "express";
import { WishListController } from "../../../controller";
import { use } from "../../../errorHandler";

const router = Router();
const controller = new WishListController();

router.get("/", use(controller.getAll.controller));
router.post("/:id", use(controller.toggle.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
