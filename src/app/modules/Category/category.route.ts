import express from 'express';
import { CategoryControllers } from './category.controller';

const router = express.Router();

// Create a new category
router.post('/create-category', CategoryControllers.createCategory);

// Get all categories
router.get('/get-categories', CategoryControllers.getCategories);

// Update an existing category
router.put('/update-category', CategoryControllers.updateCategory);

// Delete a category
router.delete('/delete-category/:category_id', CategoryControllers.deleteCategory);

export const categoryRoutes = router;
