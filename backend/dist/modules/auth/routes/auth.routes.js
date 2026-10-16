import { Router } from "express";
import { registerController, loginController, meController, logoutController, } from "../controllers/auth.controller.js";
import { authenticateToken } from "../../../middlewares/auth.middleware.js";
const router = Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authenticateToken, meController);
router.post("/logout", logoutController);
export default router;
//# sourceMappingURL=auth.routes.js.map