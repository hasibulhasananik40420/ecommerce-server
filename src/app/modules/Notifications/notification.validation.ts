import { z } from 'zod';

// Define Zod schema for notification creation and update
const createNotificationSchema = z.object({
  body: z.object({
    message: z.string({
      required_error: 'অনুগ্রহ করে মেসেজ প্রদান করুন',
    }),
    status: z.enum(['read', 'unread']).optional().default('read'),
  }),
});

export const NotificationValidation = {
  createNotificationSchema,
};
