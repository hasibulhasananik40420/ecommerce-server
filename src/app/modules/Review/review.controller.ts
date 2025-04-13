
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";

import httpStatus from "http-status";

// Create a new review
const createReview = catchAsync(async (req, res) => {
  const userId = req?.user?.id;  // Assumes you're using middleware to set the current user
  const { productId, rating, images, description } = req.body;
  const newReview = await ReviewServices.createReview({
    productId,
    user: userId,
    rating,
    images,
    description,
    createdAt: new Date(),
  });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully.",
    data: newReview,
  });
});

// Get all reviews for a product
const getReviewsByProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const reviews = await ReviewServices.getReviewsByProduct(productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully.",
    data: reviews,
  });
});

// Get a single review by ID
const getReviewById = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const review = await ReviewServices.getReviewById(reviewId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review retrieved successfully.",
    data: review,
  });
});

// Update a review
const updateReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req?.user?.id;  // Assumes you're using middleware to set the current user
  const updatedReview = await ReviewServices.updateReview(reviewId, userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully.",
    data: updatedReview,
  });
});

// Delete a review
const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req?.user?.id;  // Assumes you're using middleware to set the current user
  const result = await ReviewServices.deleteReview(reviewId, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  getReviewsByProduct,
  getReviewById,
  updateReview,
  deleteReview,
};
