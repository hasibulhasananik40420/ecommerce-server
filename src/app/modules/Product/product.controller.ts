import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";

// Create a new product
const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProduct(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully.",
    data: result,
  });
});

// Update an existing product
const updateProduct = catchAsync(async (req, res) => {
  const { product_id } = req.params;
  const result = await ProductServices.updateProduct(product_id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully.",
    data: result,
  });
});

// Delete a product
const deleteProduct = catchAsync(async (req, res) => {
  const { product_id } = req.params;
  const result = await ProductServices.deleteProduct(product_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully.",
    data: result,
  });
});

// Get a single product
const getProductById = catchAsync(async (req, res) => {
  const result = await ProductServices.getProductById(req as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieved successfully.",
    data: result.result,
    meta: result.meta,
  });
});

// Get all products
const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProducts(req as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully.",
    data: result.result,
    meta: result.meta,
  });
});

// Get all products
const getAllSearch = catchAsync(async (req, res) => {
  const searchQuery = req?.query?.searchQuery || 'nnnnnnnnnnnnnnn'
  const result = await ProductServices.getAllSearch(searchQuery as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully.",
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  getAllSearch
};
