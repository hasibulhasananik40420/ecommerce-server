import { Category, Subcategory, ThirdCategory } from './category.model';
import { notFound, serverError, forbidden } from '../../utils/errorfunc';
import { TCategory } from './category.interface';
import { Product } from '../Product/product.model';


// Create category (main, subcategory, or third-level)
const createCategory = async (payload: TCategory) => {
  const { category_name, type, parent_category_id } = payload;

  if (type === 'main') {
    // Check if a category with the same name exists
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
      throw forbidden('Category name already exists.');
    }

    const newCategory = await Category.create({ category_name });
    return newCategory;
  }

  if (type === 'subcategory') {
    // Check if the parent category exists
    const parentCategory = await Category.findById(parent_category_id);
    if (!parentCategory) {
      throw notFound('Parent category not found.');
    }

    // Ensure the subcategory name is unique under the parent category
    const existingSubcategory = await Subcategory.findOne({ category_name, parent_category_id });
    if (existingSubcategory) {
      throw forbidden('Subcategory name already exists under this category.');
    }

    const newSubcategory = await Subcategory.create({
      category_name,
      parent_category_id,
    });
    return newSubcategory;
  }

  if (type === 'thirdCategory') {
    const parentSubcategory = await Subcategory.findById(parent_category_id);
    if (!parentSubcategory) {
      throw notFound('Parent subcategory not found.');
    }

    // Ensure the third-category name is unique under the subcategory
    const existingThirdCategory = await ThirdCategory.findOne({ category_name, parent_category_id });
    if (existingThirdCategory) {
      throw forbidden('Third-category name already exists under this subcategory.');
    }

    const newThirdCategory = await ThirdCategory.create({
      category_name,
      parent_category_id,
    });
    return newThirdCategory;
  }

  throw serverError('Invalid category type.');
};

// Get all categories, subcategories, and third-level categories
const getCategories = async () => {
  const categories = await Category.find({})
    .populate({
      path: 'subcategories',
      populate: { path: 'thirdCategories' }
    })
    .exec();
  return categories;
};

// Update category name (ensure uniqueness)
const updateCategory = async (category_id: string, newCategoryName: string) => {
  const category = await Category.findById(category_id);

  if (!category) {
    throw notFound('Category not found.');
  }

  const existingCategory = await Category.findOne({ category_name: newCategoryName });
  if (existingCategory) {
    throw forbidden('Category with this name already exists.');
  }

  category.category_name = newCategoryName;
  await category.save();

  return category;
};

// Delete a category (if no product exists under it)
const deleteCategory = async (category_id: string) => {
  const category = await Category.findById(category_id);

  if (!category) {
    throw notFound('Category not found.');
  }

  // Check if any product exists under this category
  const products = await Product.find({ category_id });
  if (products.length > 0) {
    throw forbidden('Cannot delete category as products are associated with it.');
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
