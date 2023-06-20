import express from "express";
import * as userCtrls from "../controllers/userCtrls.js";
import { authenticationMiddleware, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

//USER PERMITTED ROUTES
router.post("/register", userCtrls.createUser);
router.post("/login", userCtrls.loginUser);
router.get("/refreshtoken", userCtrls.handleRefreshToken);
router.post("/logout", userCtrls.logoutUser);
router.get("/me", authenticationMiddleware, userCtrls.getUser);
router.put("/me", authenticationMiddleware, userCtrls.updateUser);
router.delete("/me", authenticationMiddleware, userCtrls.deleteUser);

//ADMIN PERMITTED ROUTES
router.get("/", authenticationMiddleware, isAdmin, userCtrls.getAllUsers);
router.put("/block_user/:id", authenticationMiddleware, isAdmin, userCtrls.blockUser);
router.put("/unblock_user/:id", authenticationMiddleware, isAdmin, userCtrls.unblockUser);

export default router;
