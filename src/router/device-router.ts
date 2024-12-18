import {Router} from 'express';
import DeviceController from "../controllers/device-controller";

const router: Router = Router();

router.post("/create", DeviceController.create);
router.post("/", DeviceController.getAll);
router.post("/read", DeviceController.getById);
router.post("/update", DeviceController.update);
router.post("/delete", DeviceController.delete);
router.post("/deleteMany", DeviceController.deleteMany);
router.post("/connect", DeviceController.connect);

export default router;