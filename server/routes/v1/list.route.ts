import { Router } from "express";
import { use } from "../../errorHandler";
import { ListController } from "../../controller";

const router = Router();
const controller = new ListController();

router.get("/category", use(controller.category.controller));
router.get("/sub-category", use(controller.subCategory.controller));
router.get("/users", use(controller.users.controller));
router.get("/customers", use(controller.customers.controller));

export default router;
