import { Schema, model } from 'mongoose';
import { TProfile, TUser } from './user.interface';

const userSchema = new Schema<TUser & TProfile>(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profiles',
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    
    role: {
      type: String,
      enum: ['customar', 'admin'],
      default: 'customar',
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'de-active'],
      default: 'active',
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
      trim: true,
    },
    verification: {
      code: { type: String },
      expired: { type: Date },
      verification: { type: Boolean },
    },
    rememberPassword: {
      type: Boolean,
      default: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const profileSchema = new Schema<TProfile>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Profile = model<TProfile>('Profiles', profileSchema);
export const User = model<TUser & TProfile>('Users', userSchema);
