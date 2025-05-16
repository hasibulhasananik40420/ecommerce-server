import { Schema, model } from "mongoose";
import { TShippingAddress } from "./shiping.address.interface";

// Define the shipping address schema
const shippingAddressSchema = new Schema<TShippingAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, "ZIP Code is required"],
      trim: true,
    },
    street: {
      type: String,
      required: [true, "Street is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    current: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
export const ShippingAddress = model<TShippingAddress>(
  "ShippingAddress",
  shippingAddressSchema
);
