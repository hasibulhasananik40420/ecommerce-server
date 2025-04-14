import express from "express";
import { ReviewControllers } from "./review.controller";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

// Create a new review
router.post(
  "/create-review",
  upload.fields([{ name: "files", maxCount: 5 }]),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  ReviewControllers.createReview
);

// Get all reviews for a product
router.get("/reviews", ReviewControllers.getReviewsByProduct);

// Get a single review by ID
router.get("/review/:reviewId", ReviewControllers.getReviewById);

// Update a review (only by the user who created it)
router.put("/update-review/:reviewId", ReviewControllers.updateReview);

// Delete a review (only by the user who created it)
router.delete("/delete-review/:reviewId", ReviewControllers.deleteReview);

export const reviewRoutes = router;
