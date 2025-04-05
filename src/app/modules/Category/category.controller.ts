import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';

// Create a new category (main, subcategory, or third-level)
const createCategory = catchAsync(async (req, res) => {
  const { category_name, type, parent_category_id } = req.body;

  const result = await CategoryServices.createCategory({ category_name, type, parent_category_id });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `Category "${category_name}" created successfully.`,
    data: result,
  });
});

// Get all categories (including nested subcategories and third categories)
const getCategories = catchAsync(async (req, res) => {
  const result = await CategoryServices.getCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully.',
    data: result,
  });
});

// Update an existing category
const updateCategory = catchAsync(async (req, res) => {
  const { category_id, category_name } = req.body;

  const result = await CategoryServices.updateCategory(category_id, category_name);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Category "${category_name}" updated successfully.`,
    data: result,
  });
});

// Delete a category
const deleteCategory = catchAsync(async (req, res) => {
  const { category_id } = req.params;

  const result = await CategoryServices.deleteCategory(category_id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully.',
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
