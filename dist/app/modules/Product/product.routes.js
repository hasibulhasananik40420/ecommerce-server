"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const router = express_1.default.Router();
// Create a new product
router.post('/create-product', product_controller_1.ProductControllers.createProduct);
// Update an existing product
router.put('/update-product/:product_id', product_controller_1.ProductControllers.updateProduct);
// Delete a product
router.delete('/delete-product/:product_id', product_controller_1.ProductControllers.deleteProduct);
// Get a single product
router.get('/product/:product_id', product_controller_1.ProductControllers.getProductById);
// Get all products
router.get('/products', product_controller_1.ProductControllers.getAllProducts);
exports.productRoutes = router;
