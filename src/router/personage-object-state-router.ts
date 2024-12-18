import { Router } from 'express';
import PersonageObjectStateController from "../controllers/personage-object-state-controller";

const router: Router = Router();

router.post("/create", PersonageObjectStateController.create);
router.post("/", PersonageObjectStateController.getAll);
router.post("/read", PersonageObjectStateController.getById);
router.post("/update", PersonageObjectStateController.update);
router.post("/delete", PersonageObjectStateController.delete);
router.post("/deleteMany", PersonageObjectStateController.deleteMany);

export default router;
