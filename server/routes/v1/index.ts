import { Router } from "express";
import customerRoute from "./customer";
import privateRoutes from "./private";
import homePageSetupRouts from "./home_page_setup.route";
import { use } from "../../errorHandler";
import { PublicTokenMiddleware, TokenVerifyMiddleware } from "../../middlewares";

const router = Router();

router.use("/private", use(TokenVerifyMiddleware), privateRoutes);
router.use("/customer", use(PublicTokenMiddleware), customerRoute);
router.use("/page", homePageSetupRouts);

export default router;
