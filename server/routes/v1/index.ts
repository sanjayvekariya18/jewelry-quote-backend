import { Router } from "express";
import customerRoute from "./customer";
import privateRoutes from "./private";
import { use } from "../../errorHandler";
import { TokenVerifyMiddleware } from "../../middlewares";

const router = Router();

router.use("/private", use(TokenVerifyMiddleware), privateRoutes);
router.use("/", customerRoute);

export default router;
