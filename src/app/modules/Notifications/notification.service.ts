import { Notification } from './notification.model';
import { notFound } from '../../utils/errorfunc';


// Update a Notification
const updateNotification = async (payload: {
  _id: string;
  message: string;
  status: 'read' | 'unread';
}) => {
  const updatedNotification = await Notification.findOneAndUpdate(
    { _id: payload._id },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedNotification) {
    throw notFound('কোন নোটিফিকেশন পাওয়া যায়নি।')
  }

  return updatedNotification;
};

// Get all Notifications
const getNotifications = async (admin: string) => {
  const result = await Notification.find({ admin }).sort({ createdAt: -1 });

  if (!result) {
    throw notFound('কোন নোটিফিকেশন পাওয়া যায়নি।')
  }

  return result;
};


const getNotificationsBySuperAdmin = async () => {
  const notifications = await Notification.find().sort({ createdAt: -1 });

  if (!notifications || notifications.length === 0) {
    throw notFound('কোন নোটিফিকেশন পাওয়া যায়নি।')
  }

  // Unique notifications based on the `message` field
  const uniqueNotifications = notifications.filter(
    (notification, index, self) =>
      index === self.findIndex((n) => n.message === notification.message),
  );

  return uniqueNotifications;
};

// Get single Notifications
const getNotification = async (id: string) => {
  const result = await Notification.findById(id);

  if (!result) {
    throw notFound('কোন নোটিফিকেশন পাওয়া যায়নি।')
  }

  return result;
};

// Delete a Notification
const deleteNotification = async (_id: string) => {
  const deletedNotification = await Notification.findOneAndDelete({ _id });

  if (!deletedNotification) {
    throw notFound('কোন নোটিফিকেশন পাওয়া যায়নি।')
  }

  return deletedNotification;
};

export const NotificationServices = {
  updateNotification,
  getNotificationsBySuperAdmin,
  getNotifications,
  getNotification,
  deleteNotification,
};
