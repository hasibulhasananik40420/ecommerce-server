import { Schema, model } from "mongoose";

const categorySchema = new Schema(
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

const subcategorySchema = new Schema(
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

export const Category = model("Category", categorySchema);
export const Subcategory = model("Subcategory", subcategorySchema);
export const ThirdCategory = model("ThirdCategory", thirdCategorySchema);
