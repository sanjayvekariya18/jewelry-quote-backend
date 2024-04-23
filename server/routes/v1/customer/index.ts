import { Router } from "express";
import { CustomerDetailsController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";
import { use } from "../../../errorHandler";
import customerDetailsRoutes from "./customerDetails.route";
import listRoutes from "./../list.route";

const router = Router();
const customerDetailsController = new CustomerDetailsController();
const basicValidatorHandler = new BasicValidatorHandler();

router.post(
	"/registration",
	basicValidatorHandler.handler(customerDetailsController.create.validation),
	use(customerDetailsController.create.controller)
);
router.post("/login", basicValidatorHandler.handler(customerDetailsController.login.validation), use(customerDetailsController.login.controller));
router.use("/customer-details", customerDetailsRoutes);
router.use("/list", listRoutes);

export default router;
