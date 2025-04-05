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
exports.CategoryServices = void 0;
const category_model_1 = require("./category.model");
const errorfunc_1 = require("../../utils/errorfunc");
const product_model_1 = require("../Product/product.model");
// Create category (main, subcategory, or third-level)
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { category_name, type, parent_category_id } = payload;
    if (type === 'main') {
        // Check if a category with the same name exists
        const existingCategory = yield category_model_1.Category.findOne({ category_name });
        if (existingCategory) {
            throw (0, errorfunc_1.forbidden)('Category name already exists.');
        }
        const newCategory = yield category_model_1.Category.create({ category_name });
        return newCategory;
    }
    if (type === 'subcategory') {
        // Check if the parent category exists
        const parentCategory = yield category_model_1.Category.findById(parent_category_id);
        if (!parentCategory) {
            throw (0, errorfunc_1.notFound)('Parent category not found.');
        }
        // Ensure the subcategory name is unique under the parent category
        const existingSubcategory = yield category_model_1.Subcategory.findOne({ category_name, parent_category_id });
        if (existingSubcategory) {
            throw (0, errorfunc_1.forbidden)('Subcategory name already exists under this category.');
        }
        const newSubcategory = yield category_model_1.Subcategory.create({
            category_name,
            parent_category_id,
        });
        return newSubcategory;
    }
    if (type === 'thirdCategory') {
        const parentSubcategory = yield category_model_1.Subcategory.findById(parent_category_id);
        if (!parentSubcategory) {
            throw (0, errorfunc_1.notFound)('Parent subcategory not found.');
        }
        // Ensure the third-category name is unique under the subcategory
        const existingThirdCategory = yield category_model_1.ThirdCategory.findOne({ category_name, parent_category_id });
        if (existingThirdCategory) {
            throw (0, errorfunc_1.forbidden)('Third-category name already exists under this subcategory.');
        }
        const newThirdCategory = yield category_model_1.ThirdCategory.create({
            category_name,
            parent_category_id,
        });
        return newThirdCategory;
    }
    throw (0, errorfunc_1.serverError)('Invalid category type.');
});
// Get all categories, subcategories, and third-level categories
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.Category.find({})
        .populate({
        path: 'subcategories',
        populate: { path: 'thirdCategories' }
    })
        .exec();
    return categories;
});
// Update category name (ensure uniqueness)
const updateCategory = (category_id, newCategoryName) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findById(category_id);
    if (!category) {
        throw (0, errorfunc_1.notFound)('Category not found.');
    }
    const existingCategory = yield category_model_1.Category.findOne({ category_name: newCategoryName });
    if (existingCategory) {
        throw (0, errorfunc_1.forbidden)('Category with this name already exists.');
    }
    category.category_name = newCategoryName;
    yield category.save();
    return category;
});
// Delete a category (if no product exists under it)
const deleteCategory = (category_id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findById(category_id);
    if (!category) {
        throw (0, errorfunc_1.notFound)('Category not found.');
    }
    // Check if any product exists under this category
    const products = yield product_model_1.Product.find({ category_id });
    if (products.length > 0) {
        throw (0, errorfunc_1.forbidden)('Cannot delete category as products are associated with it.');
    }
    // Delete the category
    // await category.remove();
    return category;
});
exports.CategoryServices = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
};
