import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0 },

    category: {
      type: String,
      enum: ["Pets", "Food", "Accessories", "Care Products"],
      required: true,
    },

    // ✅ No placeholder: allow empty, client fallback handles
    image: { type: String, default: "" },

    // ✅ Multiple images for Details page gallery
    images: { type: [String], default: [] },

    description: { type: String, default: "" },
    location: { type: String, default: "" },

    // owner
    email: { type: String, required: true },

    // meta
    status: { type: String, default: "Available" }, // Available/Sold/Adopted etc
    date: { type: Date, default: Date.now },

    // rating summary (updated from reviews)
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ListingSchema.index({ name: "text", description: "text", location: "text" });

export default mongoose.model("Listing", ListingSchema);
