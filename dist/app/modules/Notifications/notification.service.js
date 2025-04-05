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
exports.NotificationServices = void 0;
const notification_model_1 = require("./notification.model");
const errorfunc_1 = require("../../utils/errorfunc");
// Update a Notification
const updateNotification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedNotification = yield notification_model_1.Notification.findOneAndUpdate({ _id: payload._id }, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedNotification) {
        throw (0, errorfunc_1.notFound)('কোন নোটিফিকেশন পাওয়া যায়নি।');
    }
    return updatedNotification;
});
// Get all Notifications
const getNotifications = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.find({ admin }).sort({ createdAt: -1 });
    if (!result) {
        throw (0, errorfunc_1.notFound)('কোন নোটিফিকেশন পাওয়া যায়নি।');
    }
    return result;
});
const getNotificationsBySuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield notification_model_1.Notification.find().sort({ createdAt: -1 });
    if (!notifications || notifications.length === 0) {
        throw (0, errorfunc_1.notFound)('কোন নোটিফিকেশন পাওয়া যায়নি।');
    }
    // Unique notifications based on the `message` field
    const uniqueNotifications = notifications.filter((notification, index, self) => index === self.findIndex((n) => n.message === notification.message));
    return uniqueNotifications;
});
// Get single Notifications
const getNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.findById(id);
    if (!result) {
        throw (0, errorfunc_1.notFound)('কোন নোটিফিকেশন পাওয়া যায়নি।');
    }
    return result;
});
// Delete a Notification
const deleteNotification = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedNotification = yield notification_model_1.Notification.findOneAndDelete({ _id });
    if (!deletedNotification) {
        throw (0, errorfunc_1.notFound)('কোন নোটিফিকেশন পাওয়া যায়নি।');
    }
    return deletedNotification;
});
exports.NotificationServices = {
    updateNotification,
    getNotificationsBySuperAdmin,
    getNotifications,
    getNotification,
    deleteNotification,
};
