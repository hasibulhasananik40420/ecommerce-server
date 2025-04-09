import { Schema } from "mongoose";
import { USER_ROLE } from "./user.constant";
import { BaseType } from "../../utils/utils.interface";

export type TVerification = BaseType & {
  code: string;
  verification: boolean;
  expired: Date;
};

//  Represents a user type.
export type TUser = BaseType & {
  profileId: Schema.Types.ObjectId;
  email: string;
  role: "customar" | "admin";
  password: string;
  status: "active" | "de-active";
  verification?: TVerification;
  rememberPassword: boolean;
};

// Represents a profile type.
export type TProfile = BaseType & {
  name: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  address?: string;
  image?: string;
};

export type TUserRole = keyof typeof USER_ROLE;
