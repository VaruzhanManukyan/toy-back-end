import {Router} from 'express';
import AuthController from "../controllers/auth-controller";

const router: Router = Router();

router.post("/registration", AuthController.registration);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

export default router;