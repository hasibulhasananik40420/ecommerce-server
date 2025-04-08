import express from 'express';
import { CategoryControllers } from './category.controller';

const router = express.Router();

// Create a new category
router.post('/create-category', CategoryControllers.createCategory);
router.post('/create-sub-category', CategoryControllers.createSubCategory);

// Get all categories
router.get('/categories', CategoryControllers.getCategories);

// Update an existing category
router.put('/update-category', CategoryControllers.updateCategory);
// Delete a category
router.delete('/delete-category/:category_id', CategoryControllers.deleteCategory);
// Delete a category
router.delete('/delete-sub-category/:category_id', CategoryControllers.deleteSubCategory);


export const categoryRoutes = router;
