import { Router } from 'express';
import RightTransactionController from "../controllers/right-transaction-controller";

const router: Router = Router();

router.post("/create", RightTransactionController.create);
router.post("/", RightTransactionController.getAll);
router.post("/read", RightTransactionController.getById);

export default router;
