import Listing from "../models/Listing.js";


export async function getListings(req, res) {
  try {
    const {
      category,
      limit,
      page,
      search,
      location,
      sort = "newest",
      minPrice,
      maxPrice,
    } = req.query;

    const filter = {};

    if (category) filter.category = decodeURIComponent(category);
    if (location) filter.location = decodeURIComponent(location);

    // price filter
    if (minPrice != null || maxPrice != null) {
      filter.price = {};
      if (minPrice != null) filter.price.$gte = Number(minPrice);
      if (maxPrice != null) filter.price.$lte = Number(maxPrice);
    }

    // search
    if (search && search.trim()) {
      const s = search.trim();
      filter.$or = [
        { name: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
        { location: { $regex: s, $options: "i" } },
        { category: { $regex: s, $options: "i" } },
      ];
    }

    // sorting
    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };

    const isAdvanced =
      page != null ||
      search != null ||
      location != null ||
      sort != null ||
      minPrice != null ||
      maxPrice != null;

    // ✅ Legacy response (array) for old client calls
    if (!isAdvanced) {
      let q = Listing.find(filter).sort({ createdAt: -1 }).lean();
      if (limit) q = q.limit(Number(limit));
      const items = await q.exec();
      return res.json(items);
    }

    // ✅ Advanced response: { data, meta }
    const pageNum = Math.max(1, Number(page || 1));
    const limitNum = Math.min(50, Math.max(1, Number(limit || 12)));
    const skip = (pageNum - 1) * limitNum;

    const [total, data] = await Promise.all([
      Listing.countDocuments(filter),
      Listing.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.json({
      data,
      meta: { page: pageNum, limit: limitNum, total, totalPages },
    });
  } catch (err) {
    console.error("❌ getListings error:", err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
}

/**
 * GET /api/listings/mine
 * Protected – logged-in user's listings
 */
export async function getMyListings(req, res) {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const items = await Listing.find({ email }).sort({ createdAt: -1 }).lean();
    return res.json(items);
  } catch (err) {
    console.error("❌ getMyListings error:", err);
    res.status(500).json({ error: "Failed to fetch my listings" });
  }
}


export async function getListingById(req, res) {
  try {
    const item = await Listing.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ error: "Listing not found" });
    return res.json(item);
  } catch (err) {
    console.error("❌ getListingById error:", err);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
}


export async function createListing(req, res) {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const {
      name,
      price,
      category,
      image = "",
      images = [],
      description = "",
      location = "",
      stock = 0,
      status = "Available",
      date,
    } = req.body;

    if (!name || price == null || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const doc = await Listing.create({
      name: String(name).trim(),
      price: Number(price),
      category,
      image: image?.trim() || "",
      images: Array.isArray(images) ? images.filter(Boolean) : [],
      description,
      location,
      stock: Number(stock || 0),
      status,
      date: date ? new Date(date) : new Date(),
      email,
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error("❌ createListing error:", err);
    res
      .status(500)
      .json({ error: "Failed to create listing", details: err.message });
  }
}

/**
 * PUT /api/listings/:id
 * Protected – only owner can update
 */
export async function updateListing(req, res) {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    if (listing.email !== email) {
      return res.status(403).json({ error: "Forbidden: not your listing" });
    }

    const body = req.body || {};

    if (body.images && !Array.isArray(body.images)) body.images = [];
    if (body.image != null) body.image = body.image?.trim() || "";

    const updated = await Listing.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });
    return res.json(updated);
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
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: "Listing not found" });

    if (listing.email !== email) {
      return res.status(403).json({ error: "Forbidden: not your listing" });
    }

    await listing.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    console.error("❌ deleteListing error:", err);
    res.status(500).json({ error: "Failed to delete listing" });
  }
}
