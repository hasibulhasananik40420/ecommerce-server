import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    product_type: {
      type: String,
      required: [true, "Product type is required"],
    },
    image: {
      type: String,
      required: [true, "Main image URL is required"],
    },
    images: {
      type: [String],
      required: [true, "Additional images are required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    min_price: {
      type: Number,
    },
    max_price: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, "Regular price is required"],
    },
    sale_price: {
      type: Number,
      default: null,
    },
    brand: {
      type: String,
      required: [true, "Brand name is required"],
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
    },
    materials: {
      type: [String],
      required: [true, "At least one material must be specified"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
    },
    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Preorder"],
      default: "In Stock",
    },
    attributes: [
      {
        attribute_name: {
          type: String,
          required: [true, "Attribute name is required"],
        },
        values: [
          {
            value: {
              type: String,
              required: [true, "Attribute value is required"],
            },
            image: {
              type: String,
            },
            price: {
              type: Number,
              required: [true, "Attribute price is required"],
            },
            quantity: {
              type: Number,
              required: [true, "Attribute quantity is required"],
            },
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
      required: [true, "Category is required"],
    },
    subcategory: {
      type: String,
      required: [true, "Subcategory is required"],
    },
    item: {
      type: String,
      required: [true, "Item name is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
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

productSchema.pre("save", function (next) {
  const product = this as any;

  let minPrice = Infinity;
  let maxPrice = -Infinity;

  product.attributes.forEach((attribute: any) => {
    attribute.values = attribute.values.filter(
      (value: any) => value.quantity > 0
    );
    attribute.values.forEach((value: any) => {
      if (value.price < minPrice) minPrice = value.price;
      if (value.price > maxPrice) maxPrice = value.price;
    });
  });

  product.min_price = minPrice === Infinity ? 0 : minPrice;
  product.max_price = maxPrice === -Infinity ? 0 : maxPrice;

  next();
});

export const Product = model("Product", productSchema);
