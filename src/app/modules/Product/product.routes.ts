import express from "express";
import { ProductControllers } from "./product.controller";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

// Create a new product
router.post(
  "/create-product",
  upload.fields([
    { name: "file", maxCount: 1 },     
    { name: "files", maxCount: 7 },     
  ]),
  (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  
  ProductControllers.createProduct
);

// Update an existing product
router.put("/update-product/:product_id", ProductControllers.updateProduct);

// Delete a product
router.delete("/delete-product/:product_id", ProductControllers.deleteProduct);

// Get a single product
router.get("/product", ProductControllers.getProductById);

// Get all products
router.get("/products", ProductControllers.getAllProducts);

export const productRoutes = router;
