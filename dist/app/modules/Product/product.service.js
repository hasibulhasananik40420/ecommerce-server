"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const product_model_1 = require("./product.model");
const errorfunc_1 = require("../../utils/errorfunc");
// Create a new product
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProduct = yield product_model_1.Product.create(payload);
        return newProduct;
    }
    catch (error) {
        throw (0, errorfunc_1.serverError)('Error creating product');
    }
});
// Update an existing product
const updateProduct = (product_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(product_id);
    if (!product) {
        throw (0, errorfunc_1.notFound)('Product not found.');
    }
    const updatedProduct = yield product_model_1.Product.findByIdAndUpdate(product_id, payload, { new: true });
    return updatedProduct;
});
// Delete a product
const deleteProduct = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedProduct = yield product_model_1.Product.findByIdAndDelete(product_id);
    if (!deletedProduct) {
        throw (0, errorfunc_1.notFound)('Product not found.');
    }
    return deletedProduct;
});
// Get a product by its ID
const getProductById = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findById(product_id);
    if (!product) {
        throw (0, errorfunc_1.notFound)('Product not found.');
    }
    return product;
});
// Get all products
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.Product.find();
    return products;
});
exports.ProductServices = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getAllProducts,
};
