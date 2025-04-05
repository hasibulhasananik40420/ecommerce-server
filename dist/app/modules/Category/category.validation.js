"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidation = void 0;
const zod_1 = require("zod");
const categoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.string({
            required_error: 'Please sign in',
        }),
        category: zod_1.z.string({
            required_error: 'Enter category',
        }),
    }),
});
const editCategoryValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.string({
            required_error: 'Please sign in',
        }).optional(),
        category: zod_1.z.string({
            required_error: 'Enter category',
        }).optional()
    }),
});
exports.categoryValidation = {
    categoryValidationSchema, editCategoryValidationSchema
};
