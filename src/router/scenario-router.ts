import {Router} from 'express';
import {handleFileConversion, multerUploads} from "../config/multer-audio-config";
import authMiddleware from "../middlewares/auth-middleware";
import roleMiddleware from "../middlewares/role-middleware";
import {Roles} from "../shared/enums/role-enum";
import ScenarioController from "../controllers/scenario-controller";

const router: Router = Router();

router.post("/create", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), multerUploads, handleFileConversion, ScenarioController.create);
router.post("/", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]),  ScenarioController.getAll);
router.post("/read", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), ScenarioController.getById);
router.post("/update", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), multerUploads, handleFileConversion, ScenarioController.update);
router.post("/delete", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), ScenarioController.delete);
router.post("/deleteMany", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), ScenarioController.deleteMany);
router.post("/get_media_file_ids", ScenarioController.getMediaFileIds);

export default router;