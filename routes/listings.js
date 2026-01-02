import express from "express";
import {
  getListings,
  getMyListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getListings);
router.get("/mine", verifyToken, getMyListings);
router.get("/:id", getListingById);

router.post("/", verifyToken, createListing);
router.put("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);

export default router;
