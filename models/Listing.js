import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: {
      type: String,
      enum: ["Pets", "Food", "Accessories", "Care Products"],
      required: true,
    },
    image: { type: String, required: true },
    description: { type: String },
    email: { type: String, required: true },
    location: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Listing", ListingSchema);
