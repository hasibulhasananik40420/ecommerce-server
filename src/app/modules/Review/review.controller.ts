
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewServices } from "./review.service";

import httpStatus from "http-status";
 

// Create a new product
const createReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.createReview(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully.',
    data: result,
  });
});

// Get all reviews for a product
const getReviewsByProduct = catchAsync(async (req, res) => {
  const reviews = await ReviewServices.getReviewsByProduct(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully.",
    data: reviews?.result,
    meta: reviews?.meta,
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
