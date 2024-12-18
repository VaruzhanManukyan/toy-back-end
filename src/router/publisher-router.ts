import { Router } from 'express';
import PublisherController from "../controllers/publisher-controller";

const router: Router = Router();

router.post("/create", PublisherController.create);
router.post("/", PublisherController.getAll);
router.post("/read", PublisherController.getById);
router.post("/update", PublisherController.update);
router.post("/delete",  PublisherController.delete);
router.post("/deleteMany",  PublisherController.deleteMany);

export default router;