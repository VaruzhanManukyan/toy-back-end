import { Router } from "express";
import {multerUpload} from "../config/multer-image-config";
import ToyTypeController from "../controllers/toy-type-controller";

const router: Router = Router();

router.post("/create", multerUpload, ToyTypeController.create);
router.post("/", ToyTypeController.getAll);
router.post("/read", ToyTypeController.getById);
router.post("/update", multerUpload, ToyTypeController.update);
router.post("/delete", ToyTypeController.delete);
router.post("/deleteMany", ToyTypeController.deleteMany);
router.post("/search/price", ToyTypeController.searchByPriceRange);

export default router;
