import express from 'express';
import { CategoryControllers } from './category.controller';

const router = express.Router();

// Create a new category
router.post('/create-category', CategoryControllers.createCategory);
router.post('/create-sub-category', CategoryControllers.createSubCategory);
router.post('/create-third-category', CategoryControllers.createThirdCategory);

// Get all categories
router.get('/categories', CategoryControllers.getCategories);
router.get('/sub-categories', CategoryControllers.getSubCategories);

// Update an existing category
router.put('/update-category', CategoryControllers.updateCategory);
// Delete a category
router.delete('/delete-category/:category_id', CategoryControllers.deleteCategory);
// Delete a category
router.delete('/delete-sub-category/:category_id', CategoryControllers.deleteSubCategory);


export const categoryRoutes = router;
