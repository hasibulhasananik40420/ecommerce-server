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
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Email</title>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Sora', sans-serif;
      background: #1a1a1a;
      color: #f1f1f1;
    }
    .container {
      max-width: 520px;
      margin: 40px auto;
      background: #2c2c2c;
      border-radius: 10px;
      padding: 40px 30px;
      text-align: center;
      box-shadow: 0 6px 18px rgba(0,0,0,0.4);
    }
    h2 {
      font-size: 22px;
      margin-bottom: 16px;
    }
    p {
      color: #ccc;
      font-size: 15px;
    }
    .code {
      font-size: 30px;
      background: #000;
      padding: 14px 30px;
      border-radius: 8px;
      letter-spacing: 10px;
      font-weight: 600;
      color: #00ffcc;
      display: inline-block;
      margin: 25px 0;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #888;
    }
    a {
      color: #00ffcc;
      text-decoration: none;
    }
    @media(max-width: 600px) {
      .code {
        font-size: 24px;
        letter-spacing: 6px;
        padding: 12px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verify Your Account</h2>
    <p>Your one-time verification code is:</p>
    <div class="code">947520</div>
    <p>This code will expire shortly. Please use it as soon as possible.</p>
    <div class="footer">
      Need assistance? <a href="mailto:support@yourstore.com">support@yourstore.com</a><br>
      &copy; 2025 YourStore
    </div>
  </div>
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
