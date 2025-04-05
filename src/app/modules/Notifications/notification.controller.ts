/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationServices } from './notification.service';


// Update a Notification
const updateNotification = catchAsync(async (req, res) => {
  const result = await NotificationServices.updateNotification(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'নোটিফিকেশন সফলভাবে আপডেট করা হয়েছে',
    data: result,
  });
});

// Get all Notifications
const getNotifications = catchAsync(async (req, res) => {
  const result = await NotificationServices.getNotifications(req?.user?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'নোটিফিকেশন সফলভাবে লোড হয়েছে',
    data: result,
  });
});

// Get all Notifications super admin
const getNotificationsBySuperAdmin = catchAsync(async (req, res) => {
  const result = await NotificationServices.getNotificationsBySuperAdmin();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'নোটিফিকেশন সফলভাবে লোড হয়েছে',
    data: result,
  });
});

// Get all Notifications
const getNotification = catchAsync(async (req, res) => {
  const result = await NotificationServices.getNotification(
    req?.params?.id as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'নোটিফিকেশন সফলভাবে লোড হয়েছে',
    data: result,
  });
});

// Delete a Notification
const deleteNotification = catchAsync(async (req, res) => {
  const result = await NotificationServices.deleteNotification(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'নোটিফিকেশন সফলভাবে মুছে ফেলা হয়েছে',
    data: result,
  });
});

export const NotificationControllers = {
  updateNotification,
  getNotification,
  getNotificationsBySuperAdmin,
  getNotifications,
  deleteNotification,
};
