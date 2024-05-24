import { Router } from "express";
import { use } from "../../errorHandler";
import { ListController } from "../../controller";

const router = Router();
const controller = new ListController();

router.get("/category", use(controller.category.controller));
router.get("/sub-category", use(controller.subCategory.controller));
router.get("/users", use(controller.users.controller));
router.get("/customers", use(controller.customers.controller));
router.get("/attributes", use(controller.attributes.controller));
router.get("/options", use(controller.options.controller));
router.get("/products", use(controller.products.controller));

export default router;
