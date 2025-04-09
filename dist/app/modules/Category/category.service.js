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
const generateSlug_1 = require("../../utils/generateSlug");
// Create category (main, subcategory, or third-level)
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { category_name } = payload;
    const slug = (0, generateSlug_1.generateSlug)(category_name);
    const existingCategory = yield category_model_1.Category.findOne({ category_name });
    if (existingCategory) {
        throw (0, errorfunc_1.forbidden)("Category name already exists.");
    }
    const result = yield category_model_1.Category.create({ category_name, slug });
    return result;
});
const createSubCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { sub_category_name, parent_category_id } = payload;
    const category = yield category_model_1.Category.findById(parent_category_id);
    if (!category) {
        throw (0, errorfunc_1.notFound)("Category not found.");
    }
    const slug = (0, generateSlug_1.generateSlug)(sub_category_name);
    const existingCategory = yield category_model_1.Subcategory.findOne({ sub_category_name });
    if (existingCategory) {
        throw (0, errorfunc_1.forbidden)("Category name already exists.");
    }
    const result = yield category_model_1.Subcategory.create({
        sub_category_name,
        slug,
        parent_category_id,
    });
    return result;
});
const createThirdCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { third_category_name, parent_category_id, sub_category_id } = payload;
    const subCategory = yield category_model_1.Subcategory.findById(sub_category_id);
    const category = yield category_model_1.Category.findById(parent_category_id);
    if (!subCategory) {
        throw (0, errorfunc_1.notFound)("Sub category not found.");
    }
    if (!category) {
        throw (0, errorfunc_1.notFound)("Category not found.");
    }
    const slug = (0, generateSlug_1.generateSlug)(third_category_name);
    const existingCategory = yield category_model_1.Subcategory.findOne({ third_category_name });
    if (existingCategory) {
        throw (0, errorfunc_1.forbidden)("Category name already exists.");
    }
    const result = yield category_model_1.ThirdCategory.create({
        third_category_name,
        slug,
        parent_category_id,
        sub_category_id,
    });
    return result;
});
// Get all categories, subcategories, and third-level categories
const getCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.ThirdCategory.find();
    // .populate({
    //   path: "subcategories",
    //   populate: { path: "thirdCategories" },
    // })
    // .exec();
    return categories;
});
// Get all categories, subcategories, and third-level categories
const getSubCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.Subcategory.find();
    // .populate({
    //   path: "subcategories",
    //   populate: { path: "thirdCategories" },
    // })
    // .exec();
    return categories;
});
// Update category name (ensure uniqueness)
const updateCategory = (category_id, newCategoryName) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findById(category_id);
    if (!category) {
        throw (0, errorfunc_1.notFound)("Category not found.");
    }
    if ((category === null || category === void 0 ? void 0 : category.category_name) === newCategoryName) {
        throw (0, errorfunc_1.forbidden)("Category not update same name.");
    }
    const slug = (0, generateSlug_1.generateSlug)(newCategoryName);
    const existingCategory = yield category_model_1.Category.findOne({
        category_name: newCategoryName,
        slug,
    });
    if (existingCategory) {
        throw (0, errorfunc_1.forbidden)("Category with this name already exists.");
    }
    category.category_name = newCategoryName;
    yield category.save();
    return category;
});
// Delete a category (if no product exists under it)
const deleteCategory = (category_id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Category.findById(category_id);
    if (!category) {
        throw (0, errorfunc_1.notFound)("Category not found.");
    }
    // Check if any product exists under this category
    const products = yield product_model_1.Product.find({ category_id });
    if (products.length > 0) {
        throw (0, errorfunc_1.forbidden)("Cannot delete category as products are associated with it.");
    }
    // Delete the category
    const result = yield category_model_1.Category.findByIdAndDelete(category_id);
    return result;
});
// Delete a category (if no product exists under it)
const deleteSubCategory = (category_id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.Subcategory.findById(category_id);
    if (!category) {
        throw (0, errorfunc_1.notFound)("Category not found.");
    }
    // Check if any product exists under this category
    const products = yield product_model_1.Product.find({ category_id });
    if (products.length > 0) {
        throw (0, errorfunc_1.forbidden)("Cannot delete category as products are associated with it.");
    }
    // Delete the category
    const result = yield category_model_1.Subcategory.findByIdAndDelete(category_id);
    return result;
});
exports.CategoryServices = {
    createCategory,
    createSubCategory,
    createThirdCategory,
    getCategories,
    getSubCategories,
    updateCategory,
    deleteCategory,
    deleteSubCategory,
};
