import { Category, Subcategory, ThirdCategory } from "./category.model";
import { notFound, serverError, forbidden } from "../../utils/errorfunc";
import { TCategory } from "./category.interface";
import { Product } from "../Product/product.model";

// Create category (main, subcategory, or third-level)
const createCategory = async (payload: TCategory) => {
  const { category_name } = payload;

  const existingCategory = await Category.findOne({ category_name });
  if (existingCategory) {
    throw forbidden("Category name already exists.");
  }

  const result = await Category.create({ category_name });
  return result;
};

// Get all categories, subcategories, and third-level categories
const getCategories = async () => {
  const categories = await Category.find({})
    .populate({
      path: "subcategories",
      populate: { path: "thirdCategories" },
    })
    .exec();
  return categories;
};

// Update category name (ensure uniqueness)
const updateCategory = async (category_id: string, newCategoryName: string) => {
  const category = await Category.findById(category_id);

  if (!category) {
    throw notFound("Category not found.");
  }

  const existingCategory = await Category.findOne({
    category_name: newCategoryName,
  });
  if (existingCategory) {
    throw forbidden("Category with this name already exists.");
  }

  category.category_name = newCategoryName;
  await category.save();

  return category;
};

// Delete a category (if no product exists under it)
const deleteCategory = async (category_id: string) => {
  const category = await Category.findById(category_id);

  if (!category) {
    throw notFound("Category not found.");
  }

  // Check if any product exists under this category
  const products = await Product.find({ category_id });
  if (products.length > 0) {
    throw forbidden(
      "Cannot delete category as products are associated with it."
    );
  }

  // Delete the category
  // await category.remove();
  return category;
};

export const CategoryServices = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
