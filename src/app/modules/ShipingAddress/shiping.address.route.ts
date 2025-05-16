import express from "express";

import auth from "../../middlewares/auth";

import { USER_ROLE } from "../User/user.constant";

import { shippingAddressControllers } from "./shiping.address.controller";

const router = express.Router();

// Create a new shipping address
router.post(
  "/",
  auth(USER_ROLE.customar),
  shippingAddressControllers.createShippingAddress
);

// Get all shipping addresses for the logged-in user
router.get(
  "/",
  auth(USER_ROLE.customar),
  shippingAddressControllers.getMyShippingAddresses
);

// Update a specific shipping address
router.patch(
  "/update/:id",
  auth(USER_ROLE.customar),
  shippingAddressControllers.updateShippingAddress
);

// Delete a specific shipping address
router.delete(
  "/:id",
  auth(USER_ROLE.customar),
  shippingAddressControllers.deleteShippingAddress
);

// Change the current shipping address
router.patch(
  "/current/:id",
  auth(USER_ROLE.customar),
  shippingAddressControllers.changeCurrentShippingAddress
);

export const shippingAddressRoutes = router;
