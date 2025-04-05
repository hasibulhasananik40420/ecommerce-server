"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    admin: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    order: {
        type: mongoose_1.Schema.Types.ObjectId,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['read', 'unread'],
        default: 'unread',
    },
}, {
    timestamps: true,
});
exports.Notification = (0, mongoose_1.model)('Notifications', notificationSchema);
