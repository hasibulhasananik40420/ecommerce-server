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
exports.NotificationControllers = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const notification_service_1 = require("./notification.service");
// Update a Notification
const updateNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.NotificationServices.updateNotification(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'নোটিফিকেশন সফলভাবে আপডেট করা হয়েছে',
        data: result,
    });
}));
// Get all Notifications
const getNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield notification_service_1.NotificationServices.getNotifications((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'নোটিফিকেশন সফলভাবে লোড হয়েছে',
        data: result,
    });
}));
// Get all Notifications super admin
const getNotificationsBySuperAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.NotificationServices.getNotificationsBySuperAdmin();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'নোটিফিকেশন সফলভাবে লোড হয়েছে',
        data: result,
    });
}));
// Get all Notifications
const getNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield notification_service_1.NotificationServices.getNotification((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'নোটিফিকেশন সফলভাবে লোড হয়েছে',
        data: result,
    });
}));
// Delete a Notification
const deleteNotification = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.NotificationServices.deleteNotification(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'নোটিফিকেশন সফলভাবে মুছে ফেলা হয়েছে',
        data: result,
    });
}));
exports.NotificationControllers = {
    updateNotification,
    getNotification,
    getNotificationsBySuperAdmin,
    getNotifications,
    deleteNotification,
};
