import {
  Category,
  MainCategory,
  Subcategory,
  ThirdCategory,
} from "./category.model";
import { notFound, forbidden } from "../../utils/errorfunc";
import {
  TCategory,
  TItem,
  TMainCategory,
  TSubCategory2,
  TThirdCategory,
} from "./category.interface";
import { Product } from "../Product/product.model";
import { generateSlug } from "../../utils/generateSlug";

const createCategory = async (payload: TCategory) => {
  const { category_name, subcategories } = payload;

  const slug = generateSlug(category_name);

  // Check if the category already exists
  let existingCategory = await Category.findOne({ category_name });

  if (!existingCategory) {
    // If the category doesn't exist, create a new one
    existingCategory = new Category({
      category_name,
      slug,
      subcategories: subcategories || [], // If no subcategories, set as an empty array
    });
  } else {
    // If the category exists and subcategories are provided, proceed to add subcategories and items
    if (subcategories) {
      // Process each subcategory
      for (const subcategory of subcategories) {
        const { subcategory_name, items } = subcategory;
        const subcategorySlug = generateSlug(subcategory_name);

        // Check if subcategory already exists under the existing category
        let existingSubcategory = existingCategory.subcategories.find(
          (sub) => sub.subcategory_name === subcategory_name
        );

        if (!existingSubcategory) {
          // If subcategory doesn't exist, create and add it (even if there are no items)
          existingSubcategory = {
            subcategory_name,
            slug: subcategorySlug,
            items: items || [], // If no items, initialize it as an empty array
          };
          existingCategory.subcategories.push(existingSubcategory);
        }

        // If items are provided, process each item (3rd-level category) under the subcategory
        if (items && items.length > 0) {
          for (const item of items) {
            const { item_name } = item;
            const itemSlug = generateSlug(item_name);

            // Check if the item already exists within the subcategory
            const existingItem = existingSubcategory.items.find(
              (i) => i.item_name === item_name
            );
            if (!existingItem) {
              // Add the item to the subcategory's items list if it doesn't exist
              existingSubcategory.items.push({ item_name, slug: itemSlug });
            }
          }
        }
      }
    }
  }

  // Save the updated category to the database
  const result = await existingCategory.save();

  return result;
};

// Get all categories, subcategories, and third-level categories
const getCategories = async () => {
  const reslut = await Category.find();
  console.log(reslut);
  return reslut;
};

// Get all categories, subcategories, and third-level categories (items)
const getMainCategories = async () => {
  try {
    const result = await Category.find().select('category_name');

    console.log(result);
    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Could not retrieve categories');
  }
};

// Get subcategories for a given category by name (only return the subcategory names)
const getSubCategories = async (category_name: string) => {
  
    const result = await Category.findOne({ category_name }).select('subcategories.subcategory_name');

    return result ? result.subcategories : [];
};



// Update category name (ensure uniqueness)
const updateCategory = async (category_id: string, newCategoryName: string) => {
  const category = await MainCategory.findById(category_id);

  if (!category) {
    throw notFound("MainCategory not found.");
  }

  if (category?.category_name === newCategoryName) {
    throw forbidden("MainCategory not update same name.");
  }
  const slug = generateSlug(newCategoryName);
  const existingCategory = await MainCategory.findOne({
    category_name: newCategoryName,
    slug,
  });

  if (existingCategory) {
    throw forbidden("MainCategory with this name already exists.");
  }

  category.category_name = newCategoryName;
  await category.save();

  return category;
};

// Delete a category (if no product exists under it)
const deleteCategory = async (category_id: string) => {
  const category = await MainCategory.findById(category_id);

  if (!category) {
    throw notFound("MainCategory not found.");
  }

  // Check if any product exists under this category
  const products = await Product.find({ category_id });
  if (products.length > 0) {
    throw forbidden(
      "Cannot delete category as products are associated with it."
    );
  }

  // Delete the category
  const result = await MainCategory.findByIdAndDelete(category_id);
  return result;
};

// Delete a category (if no product exists under it)
const deleteSubCategory = async (category_id: string) => {
  const category = await Category.findById(category_id);

  if (!category) {
    throw notFound("MainCategory not found.");
  }

  // Delete the category
  const result = await Subcategory.findByIdAndDelete(category_id);
  return result;
};

export const CategoryServices = {
  createCategory,
  getMainCategories,
  getCategories,
  getSubCategories,
  updateCategory,
  deleteCategory,
  deleteSubCategory,
};
