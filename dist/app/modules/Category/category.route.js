"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const router = express_1.default.Router();
// Create a new category
router.post('/create-category', category_controller_1.CategoryControllers.createCategory);
router.post('/create-sub-category', category_controller_1.CategoryControllers.createSubCategory);
router.post('/create-third-category', category_controller_1.CategoryControllers.createThirdCategory);
// Get all categories
router.get('/categories', category_controller_1.CategoryControllers.getCategories);
router.get('/sub-categories', category_controller_1.CategoryControllers.getSubCategories);
// Update an existing category
router.put('/update-category', category_controller_1.CategoryControllers.updateCategory);
// Delete a category
router.delete('/delete-category/:category_id', category_controller_1.CategoryControllers.deleteCategory);
// Delete a category
router.delete('/delete-sub-category/:category_id', category_controller_1.CategoryControllers.deleteSubCategory);
exports.categoryRoutes = router;
