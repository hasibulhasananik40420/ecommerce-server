import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { CategoryDocument, TItem } from "./category.interface";


// Item Schema (3rd-level category)
const itemSchema = new Schema({
  id: { type: String, required: [true, 'Item id is required']},
  item_name: { type: String, required: true },
  slug: { type: String },
});

const subcategorySchema = new Schema({
  id: { type: String, required: true, default : uuidv4 },
  subcategory_name: { type: String, required: [true, 'Sub category is require'] },
  slug: { type: String },
  items: [itemSchema],
});

// Category Schema (Main category)
const categorySchema = new Schema({
  category_name: { type: String, required: [true, 'Category is require'] },
  icon: { type: String, required: [true, 'Icon is require'] },
  slug: { type: String },
  subcategories: [subcategorySchema],
});

export const Category = model<CategoryDocument>("Category", categorySchema);
