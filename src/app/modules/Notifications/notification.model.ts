import { Schema, model } from 'mongoose';
import { TNotification } from './notification.interface';

const notificationSchema = new Schema<TNotification>(
  {
    admin : {
      type : Schema.Types.ObjectId,
    },
    order : {
      type : Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  },
);

export const Notification = model<TNotification>(
  'Notifications',
  notificationSchema,
);
