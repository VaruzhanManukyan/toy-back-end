import {Router} from 'express';
import {handleFileConversion, multerUpload} from "../config/multer-audio-config";
import authMiddleware from "../middlewares/auth-middleware";
import roleMiddleware from "../middlewares/role-middleware";
import {Roles} from "../shared/enums/role-enum";
import AudioFileController from "../controllers/audio-file-controller";

const router: Router = Router();

router.post("/create", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), multerUpload, handleFileConversion, AudioFileController.create);
router.post("/", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), AudioFileController.getAll);
router.post("/filterByIds", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), AudioFileController.getFilteredAudioFiles);
router.post("/read", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), AudioFileController.getById);
router.post("/update", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), multerUpload, handleFileConversion, AudioFileController.update);
router.post("/delete", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), AudioFileController.delete);
router.post("/deleteMany", authMiddleware, roleMiddleware([Roles.SUPER_ADMIN]), AudioFileController.deleteMany);
router.get("/get_toy_media", AudioFileController.getToyMedia);

export default router;