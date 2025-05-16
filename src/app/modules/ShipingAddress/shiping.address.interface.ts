import { BaseType } from "../../utils/utils.interface";

//  Represents a user type.
export type TShippingAddress = BaseType & { 
  name: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  street: string;
  city: string;
  country: string;
  current:boolean;
};
