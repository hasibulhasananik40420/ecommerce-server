import { Schema } from "mongoose";

export type TMainCategory = {
  category_name: string;
  slug: string;
};

export type TSubCategory2 = {
  sub_category_name: string;
  slug: string;
  parent_category_id: Schema.Types.ObjectId;
};

export type TThirdCategory = {
  third_category_name: string;
  slug: string;
  parent_category_id: Schema.Types.ObjectId;
  sub_category_id: Schema.Types.ObjectId;
};


// Type for Item (3rd-level category)
export type TItem = {
  item_name: string;
  slug: string;
};

// Type for Subcategory (2nd-level category)
export type TSubCategory = {
  subcategory_name: string;
  slug: string;
  items: TItem[]; 
};

// Type for Category (Main category)
export type TCategory = {
  _id: string; 
  category_name: string;
  slug: string;
  subcategories: TSubCategory[]; 
};
