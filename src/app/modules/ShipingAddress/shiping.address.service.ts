/* eslint-disable @typescript-eslint/no-explicit-any */

import { forbidden } from "../../utils/errorfunc";
import { TShippingAddress } from "./shiping.address.interface";
import { ShippingAddress } from "./shiping.address.model";

// Create a new shipping address
const createShippingAddress = async (req: any) => {
  const payload = req.body;
  const user = req.user?.id;
  const isFindShippingAdress = await ShippingAddress.findOne({
    name: payload.name,
    user,
  });

  if (isFindShippingAdress) {
    throw forbidden("Shipping address already added");
  }
  const result = await ShippingAddress.create({ ...payload, user });
  return result;
};

// Get all shipping addresses for a user
const getMyShippingAddresses = async (userId: string) => {
  const result = await ShippingAddress.find({ user: userId });
  return result;
};

// Update a specific shipping address
const updateShippingAddress = async (id: string, payload: any) => { 
  const result = await ShippingAddress.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if(!result){
    throw forbidden('Something error')
  }
  return result;
};

// Delete a specific shipping address
const deleteShippingAddress = async (id: string) => {
  await ShippingAddress.findByIdAndDelete(id);
};

// Set a specific address as current and unset others
const changeCurrentShippingAddress = async (
  userId: string,
  addressId: string
) => {
  await ShippingAddress.updateMany({ user: userId }, { current: false });
  const result = await ShippingAddress.findByIdAndUpdate(
    addressId,
    { current: true },
    { new: true }
  );
  return result;
};

export const shippingAddressServices = {
  createShippingAddress,
  getMyShippingAddresses,
  updateShippingAddress,
  deleteShippingAddress,
  changeCurrentShippingAddress,
};
