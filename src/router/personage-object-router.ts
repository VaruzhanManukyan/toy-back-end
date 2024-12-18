import { Router } from 'express';
import PersonageObjectController from "../controllers/personage-object-controller";

const router: Router = Router();

router.post("/create", PersonageObjectController.create);
router.post("/", PersonageObjectController.getAll);
router.post("/read", PersonageObjectController.getById);
router.post("/update", PersonageObjectController.update);
router.post("/delete", PersonageObjectController.delete);
router.post("/deleteMany", PersonageObjectController.deleteMany);

export default router;
