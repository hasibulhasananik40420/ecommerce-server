import { Review } from "./review.model";
import { notFound, serverError, unauthorized } from "../../utils/errorfunc";
import { IReview } from "./review.interface";

// Create a new review
const createReview = async (payload: IReview) => {
  const review = await Review.create(payload);
  return review;
  
};

// Get all reviews for a product
const getReviewsByProduct = async (productId: string) => {
  const reviews = await Review.find({ productId }).populate("user", "name");
  return reviews;
  
};

// Get a single review by ID
const getReviewById = async (reviewId: string) => {
  const review = await Review.findById(reviewId).populate("user", "name");
  if (!review) {
    throw notFound("Review not found.");
  }
  return review;
  
};

// Update a review (only by the user who created it)
const updateReview = async (reviewId: string, userId: string, payload: Partial<IReview>) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw notFound("Review not found.");
  }
  if (review.user.toString() !== userId) {
    throw unauthorized("You can only update your own review.");
  }

  const updatedReview = await Review.findByIdAndUpdate(reviewId, payload, { new: true });
  return updatedReview;
};

// Delete a review (only by the user who created it)
const deleteReview = async (reviewId: string, userId: string) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw notFound("Review not found.");
  }
  if (review.user.toString() !== userId) {
    throw unauthorized("You can only delete your own review.");
  }

  // await review.remove();
  return { message: "Review deleted successfully." };
};

export const ReviewServices = {
  createReview,
  getReviewsByProduct,
  getReviewById,
  updateReview,
  deleteReview,
};
