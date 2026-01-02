import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    userUid: { type: String, required: true },
    userEmail: { type: String, default: "" },
    userName: { type: String, default: "Anonymous" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
