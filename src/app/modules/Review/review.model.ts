import { Schema, model } from "mongoose";

// Review Schema
const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product", // Assumed you have a Product model
      required: [true, "Product ID is required"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assumed you have a User model
      required: [true, "User ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Review description is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Review model
export const Review = model("Review", reviewSchema);
