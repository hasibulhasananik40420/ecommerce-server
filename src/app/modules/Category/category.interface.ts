import { Schema } from 'mongoose';

export type TCategory = {
  category_name: string;  // Category name (e.g., "Electronics")
  type: 'main' | 'subcategory' | 'thirdCategory'; // Type of category (main, subcategory, or third level)
  parent_category_id?: Schema.Types.ObjectId;  // Parent category ID (nullable for main category)
};

export type TSubcategory = {
  category_name: string; // Subcategory name (e.g., "Mobile Phones")
  parent_category_id: Schema.Types.ObjectId; // The ID of the main category (parent category)
};

export type TThirdCategory = {
  category_name: string; // Third-level category name (e.g., "Gaming Laptops")
  parent_category_id: Schema.Types.ObjectId; // The ID of the subcategory (parent subcategory)
};
