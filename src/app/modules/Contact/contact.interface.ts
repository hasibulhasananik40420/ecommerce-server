import { BaseType } from '../../utils/utils.interface';

//  Represents a user type.
export type TContact = BaseType & {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  termsAccepted: boolean;
};