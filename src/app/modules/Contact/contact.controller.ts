/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { contactsServices } from './contact.service';
// Get a single user
const createContacts = catchAsync(async (req, res) => {
  const result = await contactsServices.createContacts(req?.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Send your message.',
    data: result,
  });
});
// Get a single user
const getContacts = catchAsync(async (req, res) => {
  const result = await contactsServices.getContacts(req as any);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message successfully loaded.',
    data: result?.result,
    exportData: result?.exportData,
    meta: result?.meta,
  });
});

export const contactsControllers = { createContacts, getContacts };
