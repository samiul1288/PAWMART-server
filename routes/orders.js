import express from "express";
import { getOrders, createOrder } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getOrders);
router.post("/", verifyToken, createOrder);

export default router;
