import express from "express";
import { ReviewControllers } from "./review.controller";

const router = express.Router();

// Create a new review
router.post("/create-review", ReviewControllers.createReview);

// Get all reviews for a product
router.get("/reviews/:productId", ReviewControllers.getReviewsByProduct);

// Get a single review by ID
router.get("/review/:reviewId", ReviewControllers.getReviewById);

// Update a review (only by the user who created it)
router.put("/update-review/:reviewId", ReviewControllers.updateReview);

// Delete a review (only by the user who created it)
router.delete("/delete-review/:reviewId", ReviewControllers.deleteReview);

export const reviewRoutes = router;
