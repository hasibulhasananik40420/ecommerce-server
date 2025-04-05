"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationValidation = void 0;
const zod_1 = require("zod");
// Define Zod schema for notification creation and update
const createNotificationSchema = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z.string({
            required_error: 'Please provide the message.',
        }),
        status: zod_1.z.enum(['read', 'unread']).optional().default('read'),
    }),
});
exports.NotificationValidation = {
    createNotificationSchema,
};
