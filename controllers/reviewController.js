import Review from "../models/Review.js";
import Listing from "../models/Listing.js";

export async function getReviews(req, res) {
  try {
    const { listingId } = req.params;
    const data = await Review.find({ listingId })
      .sort({ createdAt: -1 })
      .lean();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to load reviews" });
  }
}

export async function createReview(req, res) {
  try {
    if (!req.user?.uid) return res.status(401).json({ error: "Unauthorized" });

    const { listingId } = req.params;
    const { rating, comment, userName } = req.body || {};

    if (!rating || !comment?.trim()) {
      return res.status(400).json({ error: "Rating and comment required" });
    }

    const created = await Review.create({
      listingId,
      userUid: req.user.uid,
      userEmail: req.user.email || "",
      userName:
        userName?.trim() || req.user.name || req.user.email || "Anonymous",
      rating: Number(rating),
      comment: comment.trim(),
    });

    // update listing rating summary
    const agg = await Review.aggregate([
      { $match: { listingId: created.listingId } },
      {
        $group: {
          _id: "$listingId",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (agg[0]) {
      await Listing.findByIdAndUpdate(created.listingId, {
        avgRating: Number(agg[0].avg.toFixed(2)),
        reviewCount: agg[0].count,
      });
    }

    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: "Failed to add review" });
  }
}
