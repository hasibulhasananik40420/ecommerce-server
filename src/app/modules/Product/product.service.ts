import { Product } from "./product.model";
import { notFound, serverError } from "../../utils/errorfunc";
import { TProduct } from "./product.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import compressImage from "../../utils/compressImage";
import { Review } from "../Review/review.model";

// Create a new product

const createProduct = async (req: any) => {
  const payload = req.body as TProduct;
  const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Primary image (single)
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
      console.log(profile, "Uploaded primary image");
    } catch (error) {
      throw serverError("Failed to upload the primary image.");
    }
  }

  payload.image = profile;

  // Gallery images (multiple - parallel upload using Promise.all)
  if (filesMap?.files && filesMap.files.length > 0) {
    try {
      const uploadPromises = filesMap.files.map(async (file) => {
        const compressedPath = "uploads/compressed_" + file.filename; // Define the compressed path
        await compressImage(file.path, compressedPath); // Compress image
        return sendImageToCloudinary(file.filename, compressedPath);
      });

      const uploadResults = await Promise.all(uploadPromises);

      const imageUrls = uploadResults.map((res) => res.url as string);
      payload.images = imageUrls;
    } catch (err) {
      throw serverError("One or more gallery images failed to upload.");
    }
  } else {
    payload.images = [];
  }
  if (payload.sale_price && payload.sale_price < payload.price) {
    payload.onSale = true;
  } else {
    payload.onSale = false;
  }

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
    .search(['name', 'tags'])
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
