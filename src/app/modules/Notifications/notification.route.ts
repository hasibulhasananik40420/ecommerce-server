import express from 'express';
import { NotificationControllers } from './notification.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();



// Update a notification
router.put(
  '/update-notification',
  // auth(USER_ROLE.admin, USER_ROLE.admin),
  NotificationControllers.updateNotification,
);

// Get all notifications
router.get(
  '/notifications',
  auth(USER_ROLE.admin, USER_ROLE.admin),
  NotificationControllers.getNotifications,
);


// Get all notifications for super admin
router.get(
  '/notifications-super-admin',
  auth(USER_ROLE.admin, USER_ROLE.admin),
  NotificationControllers.getNotificationsBySuperAdmin,
);


// Get all notifications
router.get(
  '/notification/:id',
  // auth(USER_ROLE.admin, USER_ROLE.admin),
  NotificationControllers.getNotification,
);

// Delete a notification
router.delete(
  '/delete-notification/:id',
  // auth(USER_ROLE.admin, USER_ROLE.admin),
  NotificationControllers.deleteNotification,
);

export const notificationRoutes = router;
