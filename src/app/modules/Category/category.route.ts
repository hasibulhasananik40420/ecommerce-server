import express from "express";
import { CategoryControllers } from "./category.controller";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

// Create a new category
router.post(
  "/create-category",
  upload.single("file"),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  CategoryControllers.createCategory
);
router.get("/main-categories", CategoryControllers.getMainCategories);

// Get all categories
router.get("/categories", CategoryControllers.getCategories);
router.get("/sub-categories/:category", CategoryControllers.getSubCategories);
router.get("/thirt-categories", CategoryControllers.getThirtCategories);

// Update an existing category
router.put("/update-category", CategoryControllers.updateCategory);
// Delete a category
router.delete(
  "/delete-category/:category_id",
  CategoryControllers.deleteCategory
);
// Delete a category
router.delete(
  "/delete-sub-category/:category_id",
  CategoryControllers.deleteSubCategory
);

export const categoryRoutes = router;
