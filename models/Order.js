// server/models/Order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    // 🔹 extra fields (document + seed file onujayi)
    buyerName: { type: String },
    email: { type: String },
    address: { type: String },
    phone: { type: String },
    additionalNotes: { type: String },
    productName: { type: String },
    // order date / delivery date – optional, na thakle createdAt use korte parba
    date: { type: Date },

    items: [
      {
        listingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Listing",
          required: true,
        },
        qty: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],

    total: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto add
  }
);

export default mongoose.model("Order", OrderSchema);
