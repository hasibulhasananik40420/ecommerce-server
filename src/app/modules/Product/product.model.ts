import { Schema, model } from "mongoose";
import { TProduct } from "./product.interface";

const productSchema = new Schema<TProduct>(
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
    sizeChart: {
      type: String,
      required: [true, "Size chart is required"],
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
    discountPrice: {
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
    onSale: {
      type: Boolean,
      required: [false],
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
    variants: [
      {
        color: {
          type: String,
          required: [true, "Color is required"],
        },
        colorCode: {
          type: String,
          required: [true, "Color code is required"],
        },
        image: {
          type: String,
          required: [true, "Image is required"],
        },

        sizes: {
          type: [
            {
              size: {
                type: String,
                required: [true, "Size is required"],
              },
              stock: {
                type: Number,
                required: [true, "Stock is required"],
              },
              price: {
                type: Number,
                required: [true, "Price is required"],
              },
            },
          ],
          required: [true, "Sizes are required"], // Ensure this is defined
        },
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
    discountEndDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// productSchema.pre("save", function (next) {
//   const product = this as any;

//   let minPrice = Infinity;
//   let maxPrice = -Infinity;

//   product.variants.forEach((variant: any) => {
//     variant.sizes = variant.sizes.filter(
//       (value: any) => value.quantity > 0
//     );
//     variant.sizes.forEach((value: any) => {
//       if (value.price < minPrice) minPrice = value.price;
//       if (value.price > maxPrice) maxPrice = value.price;
//     });
//   });

//   product.min_price = minPrice === Infinity ? 0 : minPrice;
//   product.max_price = maxPrice === -Infinity ? 0 : maxPrice;

//   next();
// });

productSchema.pre("save", function (next) {
  const product = this;

  let minPrice = Infinity;
  let maxPrice = -Infinity;

  // Check if product.variants exists and is an array
  if (product.variants && Array.isArray(product.variants)) {
    product.variants.forEach((variant) => {
      if (variant.sizes && Array.isArray(variant.sizes)) {
        // Filter sizes based on stock and price
        variant.sizes = variant.sizes.filter(
          (size) => size?.stock > 0 && size?.price > 0
        );

        variant.sizes.forEach((size) => {
          if (size.price < minPrice) minPrice = size.price;
          if (size.price > maxPrice) maxPrice = size.price;
        });
      }
    });
  }

  product.min_price = minPrice === Infinity ? 0 : minPrice;
  product.max_price = maxPrice === -Infinity ? 0 : maxPrice;

  next();
});

export const Product = model("Product", productSchema);
