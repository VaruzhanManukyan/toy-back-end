import {Router} from 'express';
import UserController from "../controllers/user-controller";

const router: Router = Router();

router.post("/create", UserController.create);
router.post("/", UserController.getAll);
router.post("/read", UserController.getById);
router.post("/update", UserController.update);
router.post("/delete", UserController.delete);
router.post("/deleteMany", UserController.deleteMany);


export default router;