"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdCategory = exports.Subcategory = exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    category_name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const subcategorySchema = new mongoose_1.Schema({
    sub_category_name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    parent_category_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
}, { timestamps: true });
const thirdCategorySchema = new mongoose_1.Schema({
    third_category_name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    parent_category_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    sub_category_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: true,
    },
}, { timestamps: true });
exports.Category = (0, mongoose_1.model)("Category", categorySchema);
exports.Subcategory = (0, mongoose_1.model)("Subcategory", subcategorySchema);
exports.ThirdCategory = (0, mongoose_1.model)("ThirdCategory", thirdCategorySchema);
