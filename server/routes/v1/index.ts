import { Router } from "express";
import customerRoute from "./customer";
import privateRoutes from "./private";
import homePageSetupRouts from "./home_page_setup.route";
import { use } from "../../errorHandler";
import { PublicTokenMiddleware, TokenVerifyMiddleware } from "../../middlewares";
import { EmailSubscribedController, ForgotPasswordController } from "../../controller";
import BasicValidatorHandler from "../../validations/handlers/BasicValidatorHandler";

const router = Router();
const basicValidatorHandler = new BasicValidatorHandler();
const controller = new EmailSubscribedController();
const forgotPasswordController = new ForgotPasswordController();

router.post("/email-subscribed", basicValidatorHandler.handler(controller.create.validation), use(controller.create.controller));
router.post("/verify-url", use(forgotPasswordController.verifyUrl.controller));
router.put(
	"/reset-password",
	basicValidatorHandler.handler(forgotPasswordController.passwordReset.validation),
	use(forgotPasswordController.passwordReset.controller)
);

router.use("/private", use(TokenVerifyMiddleware), privateRoutes);
router.use("/customer", use(PublicTokenMiddleware), customerRoute);
router.use("/page", homePageSetupRouts);

export default router;
