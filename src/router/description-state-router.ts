import { Router } from 'express';
import DescriptionStateController from "../controllers/description-state-controller";

const router: Router = Router();

router.post("/create", DescriptionStateController.create);
router.post("/", DescriptionStateController.getAll);
router.post("/read", DescriptionStateController.getById);
router.post("/update", DescriptionStateController.update);
router.post("/delete", DescriptionStateController.delete);
router.post("/deleteMany", DescriptionStateController.deleteMany)

export default router;
