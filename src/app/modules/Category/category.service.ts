import { Category } from "./category.model";
import { notFound, forbidden, serverError } from "../../utils/errorfunc";
import { TCategory } from "./category.interface";
import { Product } from "../Product/product.model";
import { generateSlug } from "../../utils/generateSlug";
// import { v4 as uuidv4 } from "uuid";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const createCategory = async (payload: TCategory, file: any) => {
  const { category_name, subcategories } = payload;

  let existingCategory = await Category.findOne({ category_name });
  const slug = generateSlug(category_name);

  let profile = existingCategory?.icon || "";
  if (file) {
    try {
      const result = await sendImageToCloudinary(file.filename, file.path);
      profile = result.url as string;
    } catch (error) {
      throw serverError("Failed to upload the image.");
    }
  }

  if (!existingCategory) {
    existingCategory = new Category({
      icon: profile,
      category_name,
      slug,
      subcategories: subcategories || [],
    });
  } else {
    if (subcategories) {
      for (const subcategory of subcategories) {
        const { subcategory_name, items } = subcategory;
        const subcategorySlug = generateSlug(subcategory_name);
        let existingSubcategory = existingCategory.subcategories.find(
          (sub) => sub.subcategory_name === subcategory_name
        );

        if (!existingSubcategory) {
          existingSubcategory = {
            subcategory_name,
            slug: subcategorySlug,
            items: items || [],
          };
          existingCategory.subcategories.push(existingSubcategory);
        }

        if (items && items.length > 0) {
          for (const item of items) {
            const { item_name } = item;
            const itemSlug = generateSlug(item_name);

            const existingItem = existingSubcategory.items.find(
              (i) => i.item_name === item_name
            );
            if (!existingItem) {
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


// const getCategories = async () => {
//   const result = await Category.aggregate([
//     {
//       $match: {
//         subcategories: { $exists: true }, 
//       },
//     },
//     {
//       $project: {
//         category_name: 1,
//         slug: 1,
//         icon: 1,
//         subcategories: 1,  
//       },
//     },
//     {
//       $unwind: {
//         path: "$subcategories",
//         preserveNullAndEmptyArrays: true,  
//       },
//     },
//     {
//       $match: {
//         "subcategories.items": { $exists: true },  
//       },
//     },
//     {
//       $project: {
//         category_name: 1,
//         slug: 1,
//         icon: 1,
//         "subcategories.subcategory_name": 1,
//         "subcategories.items": 1, 
//       },
//     },
//   ]);
 
//   return result;
// };

const getCategories = async () => {
  const result = await Category.aggregate([
    {
      $match: {
        subcategories: { $exists: true }, // Ensure subcategories field exists (even if empty)
      },
    },
    {
      $project: {
        category_name: 1,
        slug: 1,
        icon: 1,
        subcategories: 1, // Keep the subcategories field for now
      },
    },
    {
      $unwind: {
        path: "$subcategories",
        preserveNullAndEmptyArrays: true, // Keep categories even if they have no subcategories
      },
    },
    {
      $match: {
        "subcategories.items": { $exists: true }, // Ensure items field exists
      },
    },
    {
      $unwind: {
        path: "$subcategories.items", // Unwind to work with individual items
        preserveNullAndEmptyArrays: true, // Keep subcategories even if they have no items
      },
    },
    {
      $lookup: {
        from: "products", // Join with the products collection
        localField: "subcategories.items.item_name", // Match item_name in subcategory with product's item
        foreignField: "item", // Assume your product model has an `item` field
        as: "product_details",
      },
    },
    {
      $match: {
        "product_details": { $ne: [] }, // Only include subcategories that have products
      },
    },
    {
      $group: {
        _id: "$_id",
        category_name: { $first: "$category_name" },
        slug: { $first: "$slug" },
        icon: { $first: "$icon" },
        subcategories: { $push: "$subcategories" }, // Rebuild the subcategories array
      },
    },
    {
      $project: {
        category_name: 1,
        slug: 1,
        icon: 1,
        subcategories: 1, // Keep full subcategory details
      },
    },
  ]);

  return result;
};



const getMainCategories = async () => {
  try {
    const result = await Category.find().select("category_name slug");

    console.log(result);
    return result;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Could not retrieve categories");
  }
};

// Get subcategories for a given category by name (only return the subcategory names)
const getSubCategories = async (slug: string) => {
  const result = await Category.findOne({slug }).select(
    "subcategories.subcategory_name subcategories.slug"
  );

  return result ? result.subcategories : [];
};

const getThirtCategories = async (query: any) => {
  const result = await Category.findOne({
    category_name: query?.category_name,
    "subcategories.subcategory_name": query?.subcategory_name,
  }).select("subcategories");

  if (result) {
    const filteredSubcategory = result.subcategories.filter(
      (sub) => sub.subcategory_name === query?.subcategory_name
    );

    return filteredSubcategory.length > 0 ? filteredSubcategory[0] : null;
  }

  return null;
};

// Update category name (ensure uniqueness)
const updateCategory = async (category_id: string, newCategoryName: string) => {
  const category = await Category.findById(category_id);

  if (!category) {
    throw notFound("MainCategory not found.");
  }

  if (category?.category_name === newCategoryName) {
    throw forbidden("MainCategory not update same name.");
  }
  const slug = generateSlug(newCategoryName);
  const existingCategory = await Category.findOne({
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
  const category = await Category.findById(category_id);

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
  const result = await Category.findByIdAndDelete(category_id);
  return result;
};

// Delete a category (if no product exists under it)
const deleteSubCategory = async (category_id: string) => {
  const category = await Category.findById(category_id);

  if (!category) {
    throw notFound("MainCategory not found.");
  }

  // Delete the category
  const result = await Category.findByIdAndDelete(category_id);
  return result;
};

export const CategoryServices = {
  createCategory,
  getMainCategories,
  getCategories,
  getSubCategories,
  getThirtCategories,
  updateCategory,
  deleteCategory,
  deleteSubCategory,
};
