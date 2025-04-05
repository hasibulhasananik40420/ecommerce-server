import { Product } from './product.model';
import { notFound, serverError } from '../../utils/errorfunc';
import { TProduct } from './product.interface';


// Create a new product
const createProduct = async (payload: TProduct) => {
  try {
    const newProduct = await Product.create(payload);
    return newProduct;
  } catch (error) {
    throw serverError('Error creating product');
  }
};

// Update an existing product
const updateProduct = async (product_id: string, payload: Partial<TProduct>) => {
  const product = await Product.findById(product_id);
  if (!product) {
    throw notFound('Product not found.');
  }

  const updatedProduct = await Product.findByIdAndUpdate(product_id, payload, { new: true });
  return updatedProduct;
};

// Delete a product
const deleteProduct = async (product_id: string) => {
  const deletedProduct = await Product.findByIdAndDelete(product_id);
  if (!deletedProduct) {
    throw notFound('Product not found.');
  }
  return deletedProduct;
};

// Get a product by its ID
const getProductById = async (product_id: string) => {
  const product = await Product.findById(product_id);
  if (!product) {
    throw notFound('Product not found.');
  }
  return product;
};

// Get all products
const getAllProducts = async () => {
  const products = await Product.find();
  return products;
};

export const ProductServices = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
};
