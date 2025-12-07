import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { verifyToken } from "./middleware/verifyToken.js";
import listingRoutes from "./routes/listings.js";
import orderRoutes from "./routes/orders.js";

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://stunning-longma-d9a183.netlify.app",
].filter(Boolean);
app.use(cors()); 
app.use(express.json());

// Routes
app.use("/api/listings", listingRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({ message: "PawMart Backend Running!", status: "OK" });
});
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stunning-longma-d9a183.netlify.app",
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// MongoDB Connect & Start
const { MONGO_URI, PORT = 5000 } = process.env;

(async () => {
  try {
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

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB disconnected");
  process.exit(0);
});
