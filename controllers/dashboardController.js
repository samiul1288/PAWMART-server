import Listing from "../models/Listing.js";
import Order from "../models/Order.js";

export async function getDashboardSummary(req, res) {
  try {
    if (!req.user?.uid) return res.status(401).json({ error: "Unauthorized" });

    const uid = req.user.uid;
    const email = req.user.email || "";

    // counts
    const [totalListings, myListings, myOrders, pendingOrders] =
      await Promise.all([
        Listing.countDocuments({}),
        Listing.countDocuments({ email }),
        Order.countDocuments({ userId: uid }),
        Order.countDocuments({ userId: uid, status: "pending" }),
      ]);

    // chart: category breakdown
    const categoryBreakdown = await Listing.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { _id: 0, category: "$_id", count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // chart: orders per month (my)
    const ordersPerMonth = await Order.aggregate([
      { $match: { userId: uid } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1 } },
      {
        $project: {
          _id: 0,
          label: {
            $concat: [
              { $toString: "$_id.y" },
              "-",
              { $cond: [{ $lt: ["$_id.m", 10] }, "0", ""] },
              { $toString: "$_id.m" },
            ],
          },
          count: 1,
        },
      },
    ]);

    // tables
    const latestOrders = await Order.find({ userId: uid })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    const latestListings = await Listing.find({ email })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.json({
      totalListings,
      myListings,
      totalOrders: myOrders,
      pendingOrders,
      categoryBreakdown,
      ordersPerMonth,
      latestOrders,
      latestListings,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to load dashboard summary" });
  }
}
