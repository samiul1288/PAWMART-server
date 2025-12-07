// server/controllers/orderController.js
import Order from "../models/Order.js";

// Get all orders for logged-in user
export async function getOrders(req, res) {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({ error: "Unauthorized: no user ID" });
    }

    const items = await Order.find({ userId: req.user.uid })
      .populate("items.listingId") // optional
      .lean();

    res.json(items);
  } catch (err) {
    console.error("❌ getOrders error:", err.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// Create a new order (with extra fields)
export async function createOrder(req, res) {
  try {
    if (!req.user?.uid) {
      return res.status(401).json({ error: "Unauthorized: no user ID" });
    }

    const {
      items,
      total,
      buyerName,
      email,
      address,
      phone,
      additionalNotes,
      date,
      productName,
    } = req.body;

    // Basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must include items" });
    }

    // total 0 thakleo allow (free adoption)
    if (total == null || isNaN(total) || total < 0) {
      return res
        .status(400)
        .json({ error: "Order must include a valid total (0 or more)" });
    }

    const payload = {
      userId: req.user.uid,
      items,
      total,
      status: "pending",

      // 🔹 extra info (document onujayi)
      buyerName: buyerName || req.user.name || "",
      email: email || req.user.email || "",
      address: address || "",
      phone: phone || "",
      additionalNotes: additionalNotes || "",
      productName:
        productName || items?.[0]?.name || items?.[0]?.title || "Order Item",
      date: date ? new Date(date) : undefined,
    };

    const created = await Order.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error("❌ createOrder error:", err.message);
    res.status(500).json({ error: "Failed to create order" });
  }
}
