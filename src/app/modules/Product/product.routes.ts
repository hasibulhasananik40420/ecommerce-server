import express from 'express';
import { ProductControllers } from './product.controller';

const router = express.Router();

// Create a new product
router.post('/create-product', ProductControllers.createProduct);

// Update an existing product
router.put('/update-product/:product_id', ProductControllers.updateProduct);

// Delete a product
router.delete('/delete-product/:product_id', ProductControllers.deleteProduct);

// Get a single product
router.get('/product/:product_id', ProductControllers.getProductById);

// Get all products
router.get('/products', ProductControllers.getAllProducts);

export const productRoutes = router;
