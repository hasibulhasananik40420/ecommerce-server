"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required.' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'Old password is required',
        }),
        newPassword: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const verificationSchemaSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string({
            required_error: 'Enter 6 digit code',
        }),
        email: zod_1.z.string({ required_error: 'Something issue' }),
    }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required!',
        }),
    }),
});
const forgetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'User id is required!',
        }),
    }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'User id is required!',
        }),
        newPassword: zod_1.z.string({
            required_error: 'User password is required!',
        }),
    }),
});
exports.AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema,
    verificationSchemaSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
