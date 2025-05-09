import { Schema } from "mongoose";

// Type for Item (3rd-level category)
export type TItem = {
  id: string;
  item_name: string;
  slug: string;
};

// Type for Subcategory (2nd-level category)
export type TSubCategory = {
  id: string;
  subcategory_name: string;
  slug: string;
  items: TItem[];
};

// Type for Category (Main category)
export type TCategory = {
  _id: string;
  icon: string;
  category_name: string;
  slug: string;
  subcategories: TSubCategory[];
};

export interface CategoryDocument extends Document {
  category_name: string;
  slug: string;
  icon: string;
  subcategories: {
    subcategory_name: string;
    slug: string;
    items: {
      item_name: string;
      slug: string;
    }[];
  }[];
}
