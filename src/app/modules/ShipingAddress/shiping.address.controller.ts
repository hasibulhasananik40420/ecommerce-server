/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { shippingAddressServices } from './shiping.address.service';
// Get a single user

// Create a new shipping address
const createShippingAddress = catchAsync(async (req, res) => {
  
  const result = await shippingAddressServices.createShippingAddress(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Shipping address created successfully.',
    data: result,
  });
});

// Get user's shipping addresses
const getMyShippingAddresses = catchAsync(async (req, res) => {
  const result = await shippingAddressServices.getMyShippingAddresses(req?.user?.id as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping addresses retrieved successfully.',
    data: result,
  });
});

// Update a shipping address
const updateShippingAddress = catchAsync(async (req, res) => {
  const result = await shippingAddressServices.updateShippingAddress(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping address updated successfully.',
    data: result,
  });
});

// Delete a shipping address
const deleteShippingAddress = catchAsync(async (req, res) => {
  const result = await shippingAddressServices.deleteShippingAddress(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shipping address deleted successfully.',
    data: result,
  });
});

// Change the current shipping address
const changeCurrentShippingAddress = catchAsync(async (req, res) => {
  const result = await shippingAddressServices.changeCurrentShippingAddress(req?.user?.id, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Current shipping address updated successfully.',
    data: result,
  });
});

export const shippingAddressControllers = {
  createShippingAddress,
  getMyShippingAddresses,
  updateShippingAddress,
  deleteShippingAddress,
  changeCurrentShippingAddress,
};