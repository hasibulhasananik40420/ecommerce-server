import { Review } from "./review.model";
import { notFound, serverError, unauthorized } from "../../utils/errorfunc";
import { IReview } from "./review.interface";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { Product } from "../Product/product.model";
import QueryBuilder from "../../builder/QueryBuilder";

// Create a new review
const createReview = async (req: any) => {
  const payload = req.body as IReview;
  const user = req?.user?.id;
  payload.user;

  const product = await Product.findById({ _id: payload?.productId });
  if (!product) {
    throw notFound("Product not found.");
  }

  // console.log(product);
  const reviewsCount = product?.reviewsCount + 1;

  const updateProduct = {
    reviewsCount,
    rating: (payload?.rating + product?.rating) / reviewsCount,
  };
  // console.log(updateData);

  const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] };
  let images: string[] = [];
  // Gallery images (multiple - parallel upload using Promise.all)
  if (filesMap?.files && filesMap.files.length > 0) {
    const uploadPromises = filesMap.files.map(async (file) => {
      return sendImageToCloudinary(file.filename, file.path);
    });

    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults.map((res) => res.url as string);

    images = imageUrls;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: payload?.productId },
    updateProduct,
    {
      new: true,
    }
  );


  const reslut = await Review.create({ ...payload, images });

  return reslut;
};

// Get all reviews for a product
const getReviewsByProduct = async (req: any) => {
  const productId = req.query.productId
  
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
    .paginate();

  const result = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  return { result, meta };
};

// Get a single review by ID
const getReviewById = async (reviewId: string) => {
  const review = await Review.findById(reviewId).populate("user", "name");
  if (!review) {
    throw notFound("Review not found.");
  }
  return review;
};

// Update a review (only by the user who created it)
const updateReview = async (
  reviewId: string,
  userId: string,
  payload: Partial<IReview>
) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw notFound("Review not found.");
  }
  if (review.user.toString() !== userId) {
    throw unauthorized("You can only update your own review.");
  }

  const updatedReview = await Review.findByIdAndUpdate(reviewId, payload, {
    new: true,
  });
  return updatedReview;
};

// Delete a review (only by the user who created it)
const deleteReview = async (reviewId: string, userId: string) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw notFound("Review not found.");
  }
  if (review.user.toString() !== userId) {
    throw unauthorized("You can only delete your own review.");
  }

  // await review.remove();
  return { message: "Review deleted successfully." };
};

export const ReviewServices = {
  createReview,
  getReviewsByProduct,
  getReviewById,
  updateReview,
  deleteReview,
};
