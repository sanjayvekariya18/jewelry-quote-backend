import { Router } from "express";
import { CustomerDetailsController } from "../../../controller";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";
import { use } from "../../../errorHandler";
import customerDetailsRoutes from "./customerDetails.route";
import wishlistRoutes from "./wishList.route";
import productsRoutes from "./products.route";
import catalogRoutes from "./catalog.route";
import addToQuoteRoutes from "./add_to_quote.route";
import quotationRoutes from "./quotation.route";
import styleMasterRoutes from "./styleMaster.route";
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
router.use("/wishlist", wishlistRoutes);
router.use("/products", productsRoutes);
router.use("/catalog", catalogRoutes);
router.use("/add-to-quote", addToQuoteRoutes);
router.use("/quotation", quotationRoutes);
router.use("/style-master", styleMasterRoutes);
router.use("/list", listRoutes);

export default router;
