import { Router } from "express";
import { HomePageSetupController } from "../../../controller";
import { use } from "../../../errorHandler";
import BasicValidatorHandler from "../../../validations/handlers/BasicValidatorHandler";
import { RequestModification } from "../../../middlewares";

const router = Router();
const controller = new HomePageSetupController();
const basicValidatorHandler = new BasicValidatorHandler();

router.get("/:section", use(controller.findOne.controller));
router.get("/", use(controller.getAll.controller));
router.put("/slider", use(controller.updateSliderSection.controller));
router.put("/banner", use(controller.updateBannerData.controller));
router.put("/about-us", basicValidatorHandler.handler(controller.updateAboutUsSection.validation), use(controller.updateAboutUsSection.controller));
router.put("/our-category", use(controller.updateOurCategorySection.controller));
router.put(
	"/bottom-section",
	basicValidatorHandler.handler(controller.updateBottomSection.validation),
	use(controller.updateBottomSection.controller)
);
router.put("/special-offers", use(controller.updateSpecialOffersData.controller));

export default router;
