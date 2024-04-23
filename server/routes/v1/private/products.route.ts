import { Router } from "express";
import { WishListController } from "../../../controller";
import { use } from "../../../errorHandler";

const router = Router();
const controller = new WishListController();

export default router;
