"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("./notification.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
// Update a notification
router.put('/update-notification', 
// auth(USER_ROLE.admin, USER_ROLE.admin),
notification_controller_1.NotificationControllers.updateNotification);
// Get all notifications
router.get('/notifications', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.admin), notification_controller_1.NotificationControllers.getNotifications);
// Get all notifications for super admin
router.get('/notifications-super-admin', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.admin), notification_controller_1.NotificationControllers.getNotificationsBySuperAdmin);
// Get all notifications
router.get('/notification/:id', 
// auth(USER_ROLE.admin, USER_ROLE.admin),
notification_controller_1.NotificationControllers.getNotification);
// Delete a notification
router.delete('/delete-notification/:id', 
// auth(USER_ROLE.admin, USER_ROLE.admin),
notification_controller_1.NotificationControllers.deleteNotification);
exports.notificationRoutes = router;
