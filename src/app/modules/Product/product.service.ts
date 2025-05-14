import { Product } from "./product.model";
import { notFound, serverError } from "../../utils/errorfunc";
import { TProduct } from "./product.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import compressImage from "../../utils/compressImage";
import { Review } from "../Review/review.model";

// Create a new product

// const createProduct = async (req: any) => {
//   const payload = req.body as TProduct;
//   const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] };

//   // Primary image (single)
//   let profile = "";
//   if (filesMap?.file && filesMap.file.length > 0) {
//     try {
//       const compressedPath = "uploads/compressed_" + filesMap.file[0].filename;
//       await compressImage(filesMap.file[0].path, compressedPath);

//       const result = await sendImageToCloudinary(
//         filesMap.file[0].filename,
//         compressedPath
//       );
//       profile = result.url as string;
//     } catch (error) {
//       throw serverError("Failed to upload the primary image.");
//     }
//   }

//   payload.image = profile;

//   // Gallery images (multiple - parallel upload using Promise.all)
//   if (filesMap?.files && filesMap.files.length > 0) {
//     try {
//       const uploadPromises = filesMap.files.map(async (file) => {
//         const compressedPath = "uploads/compressed_" + file.filename; // Define the compressed path
//         await compressImage(file.path, compressedPath); // Compress image
//         return sendImageToCloudinary(file.filename, compressedPath);
//       });

//       const uploadResults = await Promise.all(uploadPromises);

//       const imageUrls = uploadResults.map((res) => res.url as string);
//       payload.images = imageUrls;
//     } catch (err) {
//       throw serverError("One or more gallery images failed to upload.");
//     }
//   } else {
//     payload.images = [];
//   }

//   // Process Attributes (with images)
//   if (payload.attributes && Array.isArray(payload.attributes)) {
//     console.log("Attributes received for processing:", payload.attributes);

//     const attributeUploadPromises = payload.attributes.map(
//       async (attribute, index) => {
//         console.log(`Processing attribute ${index + 1}:`, attribute);

//         if (attribute.values && Array.isArray(attribute.values)) {
//           console.log(
//             `Found ${attribute.values.length} values for attribute ${index + 1}`
//           );

//           const valuesWithImages = await Promise.all(
//             attribute.values.map(async (value, valueIndex) => {
//               console.log(
//                 `Processing value ${valueIndex + 1} of attribute ${index + 1}:`,
//                 value
//               );

//               if (
//                 value.image &&
//                 typeof value.image === "object" &&
//                 "path" in value.image &&
//                 "filename" in value.image
//               ) {
//                 console.log(
//                   `Image found for value ${valueIndex + 1} of attribute ${index + 1}:`,
//                   value.image
//                 );

//                 try {
//                   const compressedPath =
//                     "uploads/compressed_" +
//                     (value.image as { filename: string }).filename;
//                   console.log(
//                     `Compressing image for value ${valueIndex + 1} at path:`,
//                     value.image.path
//                   );

//                   await compressImage(
//                     (value.image as { path: string }).path,
//                     compressedPath
//                   );
//                   console.log(
//                     `Image compressed successfully to:`,
//                     compressedPath
//                   );

//                   const result = await sendImageToCloudinary(
//                     (value.image as { filename: string }).filename,
//                     compressedPath
//                   );
//                   console.log(
//                     `Image uploaded successfully to Cloudinary:`,
//                     result
//                   );

//                   return {
//                     ...value,
//                     image: [result.url],
//                   };
//                 } catch (error) {
//                   console.error(
//                     `Error processing image for value ${valueIndex + 1}:`,
//                     error
//                   );
//                   throw error; // Re-throw to stop further processing in case of failure
//                 }
//               } else {
//                 console.log(
//                   `No valid image found for value ${valueIndex + 1} of attribute ${index + 1}`
//                 );
//                 return value; // If no valid image is found, return the value as is
//               }
//             })
//           );

//           console.log(`Processed all values for attribute ${index + 1}`);
//           return { ...attribute, values: valuesWithImages };
//         }

//         console.log(`No values found for attribute ${index + 1}`);
//         return attribute;
//       }
//     );

//     payload.attributes = (await Promise.all(attributeUploadPromises)) as {
//       attribute_name: string;
//       values: {
//         value: string;
//         price: number;
//         image: string[];
//         size?: string[];
//         quantity?: number;
//       }[];
//     }[];

//     console.log("Final processed attributes:", payload.attributes);
//   }

//   // Handle Sale Price Logic
//   if (payload.sale_price && payload.sale_price < payload.price) {
//     payload.onSale = true;
//   } else {
//     payload.onSale = false;
//   }

//   // Create Product in Database
//   const result = await Product.create(payload);
//   return result;
// };

const createProduct = async (req: any) => {
  const payload = req.body as TProduct;
  const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Handle Primary Image
  let profile = "";
  if (filesMap?.file && filesMap.file.length > 0) {
    try {
      const compressedPath = "uploads/compressed_" + filesMap.file[0].filename;
      await compressImage(filesMap.file[0].path, compressedPath);
      const result = await sendImageToCloudinary(
        filesMap.file[0].filename,
        compressedPath
      );
      profile = result.url as string;
    } catch (error) {
      throw serverError("Failed to upload the primary image.");
    }
  }
  payload.image = profile;

  // Handle Gallery Images
  if (filesMap?.files && filesMap.files.length > 0) {
    try {
      const uploadPromises = filesMap.files.map(async (file) => {
        const compressedPath = "uploads/compressed_" + file.filename;
        await compressImage(file.path, compressedPath);
        return sendImageToCloudinary(file.filename, compressedPath);
      });
      const uploadResults = await Promise.all(uploadPromises);
      payload.images = uploadResults.map((res) => res.url as string);
    } catch (err) {
      throw serverError("One or more gallery images failed to upload.");
    }
  } else {
    payload.images = [];
  }

  // Handle Attribute Images
  // const attributeImagesMap = filesMap.attribute_images || [];
  if (payload.variants && Array.isArray(payload.variants)) {
    const attributeUploadPromises = payload.variants.map(
      async (attribute, attributeIndex) => {
        if (attribute.values && Array.isArray(attribute.values)) {
          const valuesWithImages = await Promise.all(
            attribute.values.map(async (value, valueIndex) => {
              const attributeImage =
                filesMap.attribute_images?.[valueIndex] || null;

              if (!attributeImage) {
                throw serverError(
                  `Missing image for value ${valueIndex + 1} of attribute ${
                    attributeIndex + 1
                  }`
                );
              }

              const compressedPath =
                "uploads/compressed_" + attributeImage.filename;
              await compressImage(attributeImage.path, compressedPath);
              const result = await sendImageToCloudinary(
                attributeImage.filename,
                compressedPath
              );

              return { ...value, image: [result.url] };
            })
          );

          return { ...attribute, values: valuesWithImages };
        }

        return attribute;
      }
    );
    // payload.attributes = await Promise.all(attributeUploadPromises);

    payload.variants = (await Promise.all(attributeUploadPromises)) as {
      variant_name: string;
      values: {
        value: string;
        price: number;
        image: string[];
        size?: string[];
        quantity?: number;
      }[];
    }[];
  }

  // Handle Sale Price Logic
  payload.onSale =
    payload.sale_price && payload.sale_price < payload.price ? true : false;

  // Create Product in Database
  const result = await Product.create(payload);
  return result;
};

// Get all products
const getAllProducts = async (req: any) => {
  const queryBuilder = new QueryBuilder(
    Product.find(),
    req.query as Record<string, unknown>
  );
  queryBuilder
    .search(["name", "tags"])
    .filter()
    .dateFilter("createdAt")
    .dateFilterOne("createdAt")
    .dateFilterTow("deliveryDate")
    .sort()
    .paginate();

  const result = await queryBuilder.modelQuery;

  const meta = await queryBuilder.countTotal();

  if (!result) {
    throw notFound("Product not fount");
  }
  return { result, meta };
};

// const getAllSearch = async () => {
//   const result = await Product.find().select('tags');

//   if (!result) {
//     throw notFound("Product not found");
//   }

//   // Flatten and eliminate duplicates
//   const allTags = [...new Set(result.flatMap(product => product.tags))];

//   return {tags : allTags};
// };

const getAllSearch = async (searchQuery: string) => {
  const result = await Product.find().select("tags").limit(50);

  if (!result) {
    throw notFound("Product not found");
  }

  // Flatten and eliminate duplicates
  const allTags = [...new Set(result.flatMap((product) => product.tags))];

  // Filter tags based on the search query (case-insensitive)
  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return { tags: filteredTags };
};

// Update an existing product
const updateProduct = async (
  product_id: string,
  payload: Partial<TProduct>
) => {
  const product = await Product.findById(product_id);
  if (!product) {
    throw notFound("Product not found.");
  }

  const updatedProduct = await Product.findByIdAndUpdate(product_id, payload, {
    new: true,
  });
  return updatedProduct;
};

// Delete a product
const deleteProduct = async (product_id: string) => {
  const deletedProduct = await Product.findByIdAndDelete(product_id);
  if (!deletedProduct) {
    throw notFound("Product not found.");
  }
  return deletedProduct;
};

// Get a product by its ID
const getProductById = async (req: any) => {
  // const reviews = await Review.find({ productId: product_id });
  // console.log(reviews);
  // return product;

  const productId = req.query.productId;
  const product = await Product.findById(productId);
  if (!product) {
    throw notFound("Product not found.");
  }

  // const reviews = await Review.find({ productId });
  const queryBuilder = new QueryBuilder(
    Review.find({ productId }),
    req.query as Record<string, unknown>
  );
  queryBuilder
    .search([])
    .filter()
    .dateFilter("createdAt")
    .dateFilterOne("createdAt")
    .dateFilterTow("deliveryDate")
    .sort()
    .paginate()
    // .populate('profileId', 'firstName lastName image')
    .populate("user");

  const reviews = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();

  const result = { product, reviews };
  return { result, meta };
};

export const ProductServices = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  getAllSearch,
};
