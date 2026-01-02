import Order from "../models/Order.js";

export async function getOrders(req, res) {
  try {
    if (!req.user?.uid) return res.status(401).json({ error: "Unauthorized" });

    const items = await Order.find({ userId: req.user.uid })
      .sort({ createdAt: -1 })
      .lean();

    res.json(items);
  } catch (err) {
    console.error("❌ getOrders error:", err.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

export async function createOrder(req, res) {
  try {
    if (!req.user?.uid) return res.status(401).json({ error: "Unauthorized" });

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
    } = req.body || {};

    // ✅ Validation
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order must include items" });
    }

    const invalidItem = items.find(
      (it) => !it.listingId || Number(it.qty || 1) < 1 || it.price == null
    );
    if (invalidItem) {
      return res
        .status(400)
        .json({ error: "Invalid order item (listingId/qty/price required)" });
    }

    if (total == null || isNaN(total) || Number(total) < 0) {
      return res.status(400).json({ error: "Total must be 0 or more" });
    }

    if (!address?.trim() || !phone?.trim()) {
      return res.status(400).json({ error: "Address and phone are required" });
    }

    const created = await Order.create({
      userId: req.user.uid,
      items: items.map((it) => ({
        listingId: it.listingId,
        qty: Number(it.qty || 1),
        price: Number(it.price),
      })),
      total: Number(total),
      status: "pending",
      buyerName: buyerName || req.user.name || "",
      email: email || req.user.email || "",
      address: address.trim(),
      phone: phone.trim(),
      additionalNotes: additionalNotes || "",
      productName: productName || "Order Item",
      date: date ? new Date(date) : undefined,
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("❌ createOrder error:", err.message);
    res.status(500).json({ error: "Failed to create order" });
  }
}
