// server/controllers/listingController.js
import Listing from "../models/Listing.js";

/**
 * GET /api/listings
 * Public – supports:
 *    ?category=Pets
 *    ?limit=6
 *    ?category=Pets&limit=6
 */
export async function getListings(req, res) {
  try {
    const { category, limit } = req.query;

    const filter = {};

    // ⭐ Filter by category if provided
    if (category) {
      filter.category = decodeURIComponent(category);
    }

    let query = Listing.find(filter).sort({ createdAt: -1 }).lean();

    // ⭐ Limit if provided
    if (limit) {
      query = query.limit(Number(limit));
    }

    const items = await query.exec();
    return res.json(items);
  } catch (err) {
    console.error("❌ getListings error:", err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
}

/**
 * GET /api/listings/mine
 * Protected – only logged-in user's listings
 */
export async function getMyListings(req, res) {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const items = await Listing.find({ email }).sort({ createdAt: -1 }).lean();

    return res.json(items);
  } catch (err) {
    console.error("❌ getMyListings error:", err);
    res.status(500).json({ error: "Failed to fetch my listings" });
  }
}

/**
 * GET /api/listings/:id
 * Public – single listing
 */
export async function getListingById(req, res) {
  try {
    const { id } = req.params;

    const item = await Listing.findById(id).lean();
    if (!item) {
      return res.status(404).json({ error: "Listing not found" });
    }

    return res.json(item);
  } catch (err) {
    console.error("❌ getListingById error:", err);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
}

/**
 * POST /api/listings
 * Protected – verifyToken required
 */
export async function createListing(req, res) {
  try {
    const {
      name,
      price,
      category,
      image,
      description,
      location,
      date, // optional custom date
    } = req.body;

    const email = req.user?.email; // from JWT

    if (!name || price == null || !category || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newListing = await Listing.create({
      name,
      price,
      category,
      image:
        image?.trim() ||
        "https://via.placeholder.com/400x300?text=PawMart+Listing",
      description: description || "",
      location: location || "",
      date: date || new Date(), // ✅ model-er date field
      email,
    });

    return res.status(201).json(newListing);
  } catch (err) {
    console.error("❌ createListing error:", err);

    return res.status(500).json({
      error: "Failed to create listing",
      details: err.message,
    });
  }
}

/**
 * PUT /api/listings/:id
 * Protected – only owner can update
 */
export async function updateListing(req, res) {
  try {
    const { id } = req.params;
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    // ✅ owner check
    if (listing.email !== email) {
      return res.status(403).json({ error: "Forbidden: not your listing" });
    }

    const { name, price, category, image, description, location, date } =
      req.body;

    if (name !== undefined) listing.name = name;
    if (price !== undefined) listing.price = price;
    if (category !== undefined) listing.category = category;
    if (description !== undefined) listing.description = description;
    if (location !== undefined) listing.location = location;
    if (date !== undefined) listing.date = date;
    if (image !== undefined && image !== "") {
      listing.image = image;
    }

    const saved = await listing.save();
    res.json(saved);
  } catch (err) {
    console.error("❌ updateListing error:", err);
    res.status(500).json({ error: "Failed to update listing" });
  }
}

/**
 * DELETE /api/listings/:id
 * Protected – only owner can delete
 */
export async function deleteListing(req, res) {
  try {
    const { id } = req.params;
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    // ✅ owner check
    if (listing.email !== email) {
      return res.status(403).json({ error: "Forbidden: not your listing" });
    }

    await listing.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ deleteListing error:", err);
    res.status(500).json({ error: "Failed to delete listing" });
  }
}
