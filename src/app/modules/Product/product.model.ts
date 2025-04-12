import { Schema, model } from "mongoose";

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
    min_price: { 
      type: Number
    },
    max_price: { 
      type: Number
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
      enum: ["In Stock", "Out of Stock", "Preorder"],
      default: "In Stock",
    },
    attributes: [
      {
        attribute_name: String,
        values: [
          {
            value: String,  // The specific attribute value (e.g., "Red", "XL")
            price: { type: Number, required: true },  // Price of this attribute value
            quantity: { type: Number, required: true },  // Quantity of this attribute value
          },
        ],
      },
    ],
    weight: {
      type: Number,
      default: null,
    },
    dimensions: {
      length: { type: Number, default: null },
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    },
    category: {
      type: String,
    },
    subcategory: {
      type: String,
    },
    item: {
      type: String,
    },
    tags: [String],
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    publish_date: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to calculate min_price, max_price, and filter attributes with 0 quantity
productSchema.pre("save", function (next) {
  const product = this as any;

  let minPrice = Infinity;
  let maxPrice = -Infinity;

  product.attributes.forEach((attribute: any) => {
    attribute.values = attribute.values.filter((value: any) => value.quantity > 0); // Filter out attributes with 0 quantity

    // Loop through each valid attribute value to calculate min_price and max_price
    attribute.values.forEach((value: any) => {
      if (value.price < minPrice) minPrice = value.price;
      if (value.price > maxPrice) maxPrice = value.price;
    });
  });

  // Assign the calculated min_price and max_price to the product
  product.min_price = minPrice === Infinity ? 0 : minPrice;
  product.max_price = maxPrice === -Infinity ? 0 : maxPrice;

  next();
});

export const Product = model("Product", productSchema);
