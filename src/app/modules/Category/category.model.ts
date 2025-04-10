import { Schema, model } from "mongoose";

const mainCategorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const subcategorySchema2 = new Schema(
  {
    sub_category_name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    parent_category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const thirdCategorySchema = new Schema(
  {
    third_category_name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    parent_category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sub_category_id: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
  },
  { timestamps: true }
);






export const MainCategory = model("maincategory", mainCategorySchema);
export const Subcategory = model("Subcategory", subcategorySchema2);
export const ThirdCategory = model("ThirdCategory", thirdCategorySchema);





// Item Schema (3rd-level category)
const itemSchema = new Schema({
  item_name: { type: String, required: true },
  slug: { type: String }
});
 
const subcategorySchema = new Schema({
  subcategory_name: { type: String, required: true },
  slug: { type: String},
  items: [itemSchema]  
});

// Category Schema (Main category)
const categorySchema = new Schema({
  category_name: { type: String, required: true },
  slug: { type: String},
  subcategories: [subcategorySchema]  
}); 


export const Category = model<CategoryDocument>('Category', categorySchema);



// TypeScript Interface for Category Document
interface CategoryDocument extends Document {
  category_name: string;
  slug: string;
  subcategories: {
    subcategory_name: string;
    slug: string;
    items: {
      item_name: string;
      slug: string;
    }[];
  }[];
}