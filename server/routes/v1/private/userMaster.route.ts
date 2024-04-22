import { Router } from "express";
import { requestValidate } from "../../../utils/helper";
import { use } from "../../../errorHandler";
import { UserMasterController } from "../../../controller";
import { RequestModification } from "../../../middlewares";

const router = Router();
const controller = new UserMasterController();

router.get("/", use(controller.getAll.controller));
router.get("/:id", use(controller.findOne.controller));
router.post("/", requestValidate(controller.create.validation), use(controller.create.controller));
router.put("/change-password", requestValidate(controller.changePassword.validation), use(controller.changePassword.controller));
router.put("/:id", requestValidate(controller.edit.validation), use(controller.edit.controller));
router.put("/toggle-user-active/:id", use(controller.toggleUserActive.controller));
router.delete("/:id", use(controller.delete.controller));

export default router;
