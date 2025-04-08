/* eslint-disable @typescript-eslint/no-explicit-any */
import { Profile, User } from './user.model';
import { forbidden, notFound, serverError } from '../../utils/errorfunc';
import { TProfile, TUser } from './user.interface';
import { Schema, startSession } from 'mongoose';
import { generateUniqueCode } from '../../utils/generateUniqueCode';
import { hashedPassword } from '../../utils/hashedPassword';
import sendEmail from '../../utils/sendEmail';
import { TEmailInfo } from '../../utils/utils.interface';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import QueryBuilder from '../../builder/QueryBuilder';
import { IMyRequest } from '../../utils/decoded';

// Get a single user
const getUser = async (id: string) => {
  const user = await User.findById(id).populate('profileId');
  if (!user) {
    throw notFound('No user found.');
  }
  return user;
};

const getMe = async (id: string) => {
  const user = await User.findById(id)
    .populate('profileId')
    .select('-verification');

  if (!user) {
    throw notFound('No user found.');
  }

  // Destructure and reassemble the user data
  const { profileId, email, ...restUserData } = user.toObject();

  return { ...profileId, email, ...restUserData };
};

const getUsers = async (req: IMyRequest) => {
  const query = req?.query || {};

  const queryBuilder = new QueryBuilder(
    User.find({ role: 'customar' }),
    query as Record<string, unknown>,
  );

  queryBuilder
    .search([])
    .filter()
    .dateFilter('createdAt')
    .populate('profileId')
    .sort()
    .paginate();

  const result = await queryBuilder.modelQuery;
  console.log(result)
  const meta = await queryBuilder.countTotal();
  return { result, meta };
};

// Create a new user
const createUser = async (payload: TUser & TProfile) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const isExitsUser = await User.findOne({ email: payload?.email });
    if (isExitsUser) {
      throw notFound('User already exists.');
    }

    const password = await hashedPassword(payload?.password);
    const code = generateUniqueCode(6);
    const newProfile: TProfile = {
      name: payload?.name,
      phone: payload?.phone,
      email: payload?.email,
      image: payload?.image || '',
    };

    // Profile creation within the transaction
    const userProfile = await Profile.create([newProfile], { session });

    const expired = new Date();
    expired.setMinutes(expired.getMinutes() + 2);

    const newUserInfo: TUser = {
      profileId: userProfile[0]?._id as Schema.Types.ObjectId,
      email: payload.email as string,
      role: 'customar',
      password,
      rememberPassword: false,
      status: 'active',
      verification: { code, verification: false, expired },
    };

    const emailData: TEmailInfo = {
      email: payload?.email,
      body: `
       <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify OTP to Change Password</title>
    <style>
      svg {
        height: 30px !important;
      }
    </style>
  </head>
  <body style="font-family: Arial, sans-serif;  color: #fff; margin: 0; padding: 0;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #111; border-radius: 8px; box-shadow: 0 4px 8px rgba(255, 255, 0, 0.2); text-align: center;">
            <!-- Header with Logo -->
            <tr>
              <td style="background-color: #ffed00; padding: 10px; text-align: center;">
              
          <img src="https://res.cloudinary.com/dssmacjme/image/upload/v1741600767/vr4iqumzttiqefri1h3n.jpg" alt="Skillion" height="30" class="CToWUd" data-bit="iit">
        
              </td>
            </tr>
            <!-- OTP Section -->
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #fff; font-size: 24px;">🔐 Verify Your OTP</h2>
                <table align="center" style="background-color: #222; padding: 10px; border-radius: 5px;">
                  <tr>
                    <td style="font-size: 28px; font-weight: bold; color: #ffed00;">${code}</td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: red; margin-top: 10px; font-weight: bold;">
                  ⚠ This OTP is valid for **only 5 minutes**. Please use it before it expires!
                </p>
                <p style="font-size: 14px; color: #bbb; margin-top: 10px;">For security reasons, never share your OTP with anyone.</p>
              </td>
            </tr>
            <!-- Footer Links -->
            <tr>
              <td style="background-color: #000; padding: 15px; text-align: center; font-size: 14px;">
                <a href="https://www.facebook.com/skilliontech.official" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">Facebook</a>
                <a href="https://www.youtube.com/@SkillionTech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">YouTube</a>
                <a href="https://www.tiktok.com/@skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">TikTok</a>
                <a href="https://www.linkedin.com/company/skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">LinkedIn</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
      subject: 'Verify OTP',
    };

    const mainSended = await sendEmail(emailData);

    if (mainSended) {
      await User.create([newUserInfo], { session });
      await session.commitTransaction();
    } else {
      throw new Error('Failed to send email.');
    }
  } catch (error) {
    // Rollback the transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Update an existing user
const updateUser = async (req: any) => {
  const id: string = req?.user?.id;
  const payload: TUser & TProfile = req?.body;
  const file: any = req?.file;

  const isUser = (await User.findById(id).select('+password')) as TUser &
    TProfile;

  if (!isUser) {
    throw notFound('No user found');
  }

  let profile = isUser.image;
  if (file) {
    try {
      const result = await sendImageToCloudinary(file.filename, file.path);
      profile = result.url as string;
    } catch (error) {
      throw serverError('Failed to upload the image.');
    }
  }

  payload.image = profile;

  await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  const updatedUser = await Profile.findOneAndUpdate(
    { email: isUser?.email },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedUser) {
    throw forbidden('User update filled');
  }
  return updatedUser;
};

// Delete a user
const deleteUser = async (id: string) => {
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw notFound('No user found.');
  }
  return deletedUser;
};

export const UserServices = {
  getUser,
  getMe,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
