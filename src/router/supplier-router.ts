import { Router } from 'express';
import SupplierController from "../controllers/supplier-controller";

const router: Router = Router();

router.post("/create", SupplierController.create);
router.post("/", SupplierController.getAll);
router.post("/read", SupplierController.getById);
router.post("/update", SupplierController.update);
router.post("/delete", SupplierController.delete);
router.post("/deleteMany", SupplierController.deleteMany);

export default router;