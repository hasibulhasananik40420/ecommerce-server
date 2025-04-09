import { Category, Subcategory, ThirdCategory } from "./category.model";
import { notFound, serverError, forbidden } from "../../utils/errorfunc";
import { TCategory, TSubCategory, TThirdCategory } from "./category.interface";
import { Product } from "../Product/product.model";
import { generateSlug } from "../../utils/generateSlug";

// Create category (main, subcategory, or third-level)
const createCategory = async (payload: TCategory) => {
  const { category_name } = payload;
  const slug = generateSlug(category_name);
  const existingCategory = await Category.findOne({ category_name });
  if (existingCategory) {
    throw forbidden("Category name already exists.");
  }

  const result = await Category.create({ category_name, slug });
  return result;
};

const createSubCategory = async (payload: TSubCategory) => {
  const { sub_category_name, parent_category_id } = payload;
  const category = await Category.findById(parent_category_id);

  if (!category) {
    throw notFound("Category not found.");
  }
  const slug = generateSlug(sub_category_name);
  const existingCategory = await Subcategory.findOne({ sub_category_name });
  if (existingCategory) {
    throw forbidden("Category name already exists.");
  }

  const result = await Subcategory.create({
    sub_category_name,
    slug,
    parent_category_id,
  });
  return result;
};

const createThirdCategory = async (payload: TThirdCategory) => {
  const { third_category_name, parent_category_id, sub_category_id } = payload;
  const subCategory = await Subcategory.findById(sub_category_id);
  const category = await Category.findById(parent_category_id);

  if (!subCategory) {
    throw notFound("Sub category not found.");
  }
  if (!category) {
    throw notFound("Category not found.");
  }
  const slug = generateSlug(third_category_name);
  const existingCategory = await Subcategory.findOne({ third_category_name });
  if (existingCategory) {
    throw forbidden("Category name already exists.");
  }

  const result = await ThirdCategory.create({
    third_category_name,
    slug,
    parent_category_id,
    sub_category_id,
  });
  return result;
};

// Get all categories, subcategories, and third-level categories
const getCategories = async () => {
  const categories = await ThirdCategory.find()

  console.log(categories)

  // .populate({
  //   path: "subcategories",
  //   populate: { path: "thirdCategories" },
  // })
  // .exec();
  return categories;
};

// Get all categories, subcategories, and third-level categories
const getSubCategories = async () => {
  const categories = await Subcategory.find();
  // .populate({
  //   path: "subcategories",
  //   populate: { path: "thirdCategories" },
  // })
  // .exec();
  return categories;
};

// Update category name (ensure uniqueness)
const updateCategory = async (category_id: string, newCategoryName: string) => {
  const category = await Category.findById(category_id);

  if (!category) {
    throw notFound("Category not found.");
  }

  if (category?.category_name === newCategoryName) {
    throw forbidden("Category not update same name.");
  }
  const slug = generateSlug(newCategoryName);
  const existingCategory = await Category.findOne({
    category_name: newCategoryName,
    slug,
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
  const result = await Category.findByIdAndDelete(category_id);
  return result;
};

// Delete a category (if no product exists under it)
const deleteSubCategory = async (category_id: string) => {
  const category = await Subcategory.findById(category_id);

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
  const result = await Subcategory.findByIdAndDelete(category_id);
  return result;
};

export const CategoryServices = {
  createCategory,
  createSubCategory,
  createThirdCategory,
  getCategories,
  getSubCategories,
  updateCategory,
  deleteCategory,
  deleteSubCategory,
};
