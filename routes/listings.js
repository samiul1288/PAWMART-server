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

// public
router.get("/", getListings);

// protected – only logged-in user's own listings
router.get("/mine", verifyToken, getMyListings);

// public single
router.get("/:id", getListingById);

// protected create/update/delete
router.post("/", verifyToken, createListing);
router.put("/:id", verifyToken, updateListing);
router.delete("/:id", verifyToken, deleteListing);

export default router;
