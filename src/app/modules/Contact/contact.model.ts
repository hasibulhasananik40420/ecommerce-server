import { Schema, model } from 'mongoose';
import { TContact } from './contact.interface';



const contactSchema = new Schema<TContact>(
  {
    
    firstName: {
      type: String,
      required: [true, 'Enter your first name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Enter your last name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Enter your email'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Enter your phone'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Enter message'],
    },
    termsAccepted: {
      type: Boolean,
      required: [true, 'Accepted terms and condition'],
      trim: true,
    },
   
  },
  {
    timestamps: true,
  },
);


export const Contacts = model<TContact>('contacts', contactSchema);
