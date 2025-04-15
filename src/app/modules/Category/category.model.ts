import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { CategoryDocument, TItem } from "./category.interface";

// Item Schema (3rd-level category)
const itemSchema = new Schema({
  id: {
    type: String,
    required: [true, "Item id is required"],
    default: uuidv4,
  },
  item_name: { 
    type: String, 
    required: true,
    trim: true // Trim whitespaces from item_name
  },
  slug: { 
    type: String, 
    trim: true // Trim whitespaces from slug
  },
});

const subcategorySchema = new Schema({
  id: { 
    type: String, 
    required: true, 
    default: uuidv4 
  },
  subcategory_name: {
    type: String,
    required: [true, "Subcategory is required"],
    trim: true // Trim whitespaces from subcategory_name
  },
  slug: { 
    type: String,
    trim: true // Trim whitespaces from slug
  },
  items: [itemSchema],
});

// Category Schema (Main category)
const categorySchema = new Schema({
  category_name: { 
    type: String, 
    required: [true, "Category is required"], 
    trim: true // Trim whitespaces from category_name
  },
  icon: { 
    type: String,
    trim: true // Trim whitespaces from icon
  },
  slug: { 
    type: String, 
    trim: true // Trim whitespaces from slug
  },
  subcategories: [subcategorySchema],
});

export const Category = model<CategoryDocument>("Category", categorySchema);
