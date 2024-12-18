import { Router } from 'express';
import ToyController from "../controllers/toy-controller";

const router: Router = Router();

router.post("/create", ToyController.create);
router.post("/", ToyController.getAll);
router.post("/read", ToyController.getById);
router.post("/update", ToyController.update);
router.post("/delete", ToyController.delete);
router.post("/deleteMany", ToyController.deleteMany);

export default router;