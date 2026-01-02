import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// routes
import listingRoutes from "./routes/listings.js";
import orderRoutes from "./routes/orders.js";
import reviewRoutes from "./routes/reviews.js"; // ✅ NEW
import dashboardRoutes from "./routes/dashboard.js"; // ✅ NEW

const app = express();

/* -------------------- Middleware -------------------- */

// ✅ allowed origins (env + localhost + netlify)
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://stunning-longma-d9a183.netlify.app",
].filter(Boolean);

// ✅ CORS - single place only
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server / Postman / curl
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ✅ Preflight


app.use(express.json({ limit: "2mb" }));

/* -------------------- Routes -------------------- */

app.get("/", (req, res) => {
  res.json({ message: "PawMart Backend Running!", status: "OK" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ✅ API routes
app.use("/api/listings", listingRoutes);
app.use("/api/orders", orderRoutes);

// ✅ NEW routes for assignment requirement
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);

/* -------------------- Error Handler -------------------- */

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  // CORS error
  if (err.message?.startsWith("CORS blocked")) {
    return res.status(403).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal Server Error" });
});

/* -------------------- MongoDB Connect & Start -------------------- */

const { MONGO_URI, PORT = 5000 } = process.env;

(async () => {
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI missing in .env");

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
})();

/* -------------------- Graceful Shutdown -------------------- */

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB disconnected");
  process.exit(0);
});
