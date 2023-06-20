import express from "express";
import * as productCtrls from "../controllers/productCtrls.js";
import { authenticationMiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticationMiddleware, isAdmin, productCtrls.createProduct);
router.get("/:productid", productCtrls.getProduct);
router.put("/:productid", authenticationMiddleware, isAdmin, productCtrls.updateProduct);
router.delete("/:productid", authenticationMiddleware, isAdmin, productCtrls.deleteProduct);
router.get("/", productCtrls.getAllProduct);

export default router;
