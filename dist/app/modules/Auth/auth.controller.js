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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is logged in successfully!',
        data: { accessToken },
    });
}));
const logoutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.refreshToken;
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (error) {
        res.status(401).json({
            message: 'Unauthorized: Invalid or expired token',
        });
        return;
    }
    yield auth_service_1.AuthServices.logoutUser(req, decoded);
    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User logged out successfully!',
        data: null,
    });
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.refreshToken(req, res);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access token is retrieved successfully!',
        data: result.accessToken,
    });
}));
const forgerPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.forgerPassword(req.body.email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Verification code has been sent!`,
        data: result,
    });
}));
const verification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.verification(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'You are verified!',
        data: result,
    });
}));
const setNewPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield req.cookies.validation;
    const result = yield auth_service_1.AuthServices.setNewPassword(validation, req.body.password);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password has been changed!',
        data: result,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.changePassword(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password has been changed!',
        data: result,
    });
}));
// Create a new user
const verificationCodeReSend = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield auth_service_1.AuthServices.verificationCodeReSend(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `${(_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email} Check your email and use the 6-digit code.`,
        data: result,
    });
}));
const verificationForgetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { validation } = yield auth_service_1.AuthServices.verificationForgetPassword(req.body);
    res.cookie('validation', validation, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 1000 * 60 * 5,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Verified!',
        data: validation,
    });
}));
exports.AuthControllers = {
    loginUser,
    logoutUser,
    refreshToken,
    verification,
    forgerPassword,
    changePassword,
    setNewPassword,
    verificationForgetPassword,
    verificationCodeReSend,
};
