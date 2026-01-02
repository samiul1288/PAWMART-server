import express from "express";
import { getReviews, createReview } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/:listingId", getReviews);
router.post("/:listingId", verifyToken, createReview);

export default router;
