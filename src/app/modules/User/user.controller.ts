/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

// Get a single user
const getMe = catchAsync(async (req, res) => {
  const result = await UserServices.getMe(req?.user?.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My information  loaded.',
    data: result,
  });
});
// Get a single user
const getUser = catchAsync(async (req, res) => {
  const result = await UserServices.getUser(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'The user has been successfully loaded.',
    data: result,
  });
});

// Get all users
const getUsers = catchAsync(async (req : any, res) => {
  const result = await UserServices.getUsers( req as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users have been successfully loaded.',
    data: result.result,
    meta: result.meta,
  });
});

// Create a new user
const createUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `${req?.body?.email} Check your email and use the 6-digit code.`,
    data: result,
  });
});



// Update an existing user
const updateUser = catchAsync(async (req, res) => {
  const result = await UserServices.updateUser(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been successfully updated.',
    data: result,
  });
});

// Delete a user
const deleteUser = catchAsync(async (req, res) => {
  const result = await UserServices.deleteUser(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User has been successfully deleted.',
    data: result,
  });
});

export const UserControllers = {
  getUser,
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
