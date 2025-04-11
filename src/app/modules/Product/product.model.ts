import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    regular_price: {
      type: Number,
      required: true,
    },
    sale_price: {
      type: Number,
      default: null,
    },
    stock_quantity: {
      type: Number,
      required: true,
    },
    stock_status: {
      type: String,
      enum: ['In Stock', 'Out of Stock', 'Preorder'],
      default: 'In Stock',
    },
    attributes: [
      {
        attribute_name: String,
        values: [String],
      },
    ],
    // primary_image: {
    //   type: String,
    //   required: true,
    // },
    // gallery_images: [String],
    weight: {
      type: Number,
      default: null,
    },
    dimensions: {
      length: { type: Number, default: null },
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    }, 
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    tags: [String],
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
    publish_date: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Product = model('Product', productSchema);
