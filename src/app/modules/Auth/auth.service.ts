/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config, {
  jwt_access_expires_in,
  jwt_refresh_expires_in,
} from '../../config';
import AppError from '../../errors/AppError';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import sendEmail from '../../utils/sendEmail';
import { Twilio } from 'twilio';
import { TEmailInfo } from '../../utils/utils.interface';
import { forbidden, notFound } from '../../utils/errorfunc';
import { Profile, User } from '../User/user.model';
import { TProfile, TUser, TVerification } from '../User/user.interface';
import { generateUniqueCode } from '../../utils/generateUniqueCode';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw notFound('User not found!');
  }
  if (!user?.verification?.verification) {
    throw notFound('You are not verified!');
  }
  // checking if the user is already deleted
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user?.password,
  );

  if (!isPasswordMatched) {
    throw forbidden('Please provide the correct password.');
  }

  const userStatus = user?.status;
  if (userStatus === 'de-active') {
    throw forbidden('The account has been blocked.');
  }

  if (user?.status !== 'active') {
    throw forbidden('Please provide the correct password.');
  }

  
  const isProfile = await Profile.findOne({ email: user?.email });

  
  if (isProfile === null) {
    throw forbidden('Something was wrong.');
  }

  await user.save();

  

  

  const jwtPayload = {
    email: user?.email,
    name: isProfile?.name,
    phone: isProfile?.phone,
    profile: isProfile?._id,
    id: user?._id,
    role: user?.role,
  };

  console.log(jwtPayload)

  

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const logoutUser = async (req: any, data: any) => {
  // const token = req.cookies.refreshToken;
  // const token = req.headers.authorization;

  const token = req.cookies.refreshToken;

  if (!token) {
    throw notFound('Something was wrong');
  }

  await User.updateOne(
    { email: data?.email },
    { $pull: { devices: { deviceId: data?.deviceId } } },
  );

  req.headers.authorization = '';
  req.cookies.refreshToken = '';
};

const refreshToken = async (req: any, res: any) => {
  const { refreshToken } = req.cookies;

  const decoded = verifyToken(
    refreshToken,
    config.jwt_refresh_secret as string,
  );

  const { email, deviceId } = decoded;
  const user = (await User.findOne({ email })) as unknown as TUser;

  if (!user) {
    throw notFound('User not found!');
  }

  const userStatus = user?.status;
  if (userStatus === 'de-active') {
    throw forbidden('Please provide the correct password.');
  }
  if (user.status !== 'active') {
    throw forbidden('Please provide the correct password.');
  }

  const isDevice = await User.findOne({
    email: decoded?.email,
    'devices.deviceId': deviceId,
  });

  if (isDevice === null || !isDevice) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Session is expire new error!',
      [
        {
          path: 'unauthorized',
          message: 'Session is expire new error!',
        },
      ],
    );
  }

  res.clearCookie('connect.sid');

  await User.updateOne(
    { email: user?.email, 'devices.deviceId': deviceId },
    {
      $set: {
        'devices.$.lastActivity': new Date(),
      },
    },
  );


  const jwtPayload = {
    email: user?.email,
    id: user?._id,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgerPassword = async (email: string) => {
  // checking if the user is exist
  const user: TUser | null = await User.findOne({ email });
  if (!user) {
    throw notFound('User not found!');
  }

  const verification = user?.verification?.verification;

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'de-active') {
    throw forbidden('This use was blocked.');
  }

  const code = generateUniqueCode(6);

  const body = `This is your verification code ${code}`;

  const emailData: TEmailInfo = {
    email: email,
    body: ` <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Password</title>
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
       color: #f1f1f1;
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
      <h2>Reset Your Password</h2>
    <p>Use the 6-digit code below to reset your password:</p>
    <div class="code">${code}</div>
    <p>This code is valid for a limited time. Do not share it with anyone.</p>
    <div class="footer">
      Need help? <a href="mailto:support@rockit.com">support@yourstore.com</a><br>
      &copy; ${new Date().getFullYear()} YourStore
    </div>
  </div>
</body>
</html>

    `,
    subject: 'Verify OTP to Change Password',
  };

  const sentMail = await sendEmail(emailData);

  const expired = new Date();
  expired.setMinutes(expired.getMinutes() + 2);
  // const sentMail = true;
  if (sentMail) {
    await User.findOneAndUpdate(
      { email },
      { verification: { code, verification, expired } },
    );
  }

  return body;
};

const sendOPTPhone = async (phone: string) => {
  // checking if the user is exist
  const user = await User.findOne({ phonePrimary: phone });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'de-active') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const verificationCode = Math.floor(
    10000 + Math.random() * 900000,
  ).toString();

  const accountSid = config.twilioAccountSid;
  const authToken = config.twilioAuthToken;
  const twilioPhoneNumber = '+8801762844222';

  const client = new Twilio(accountSid, authToken);

  const generateOTP = () => {
    // Generate a random 6-digit OTP
    return Math.floor(10000 + Math.random() * 900000).toString();
  };

  const otp = generateOTP();
  const message = await client.messages.create({
    body: 'You have an appointment with Owl, Inc. on Friday, November 3 at 4:00 PM. Reply C to confirm.',
    from: twilioPhoneNumber,
    to: phone,
  });

  // const now = new Date();
  const futureTime = new Date().getTime() + 5 * 60000;

  const sentOTP = true;

  if (sentOTP) {
    await User.findOneAndUpdate(
      { phoneOne: phone },
      { verification: { code: verificationCode, time: futureTime } },
    );
  }

  return `${message} your opt ${otp}`;
};

const verification = async (payload: TVerification) => {
  console.log(payload)
  const user = await User.findOne({ email: payload.email }).select(
    'verification',
  );

  if (!user) {
    throw forbidden('Something went wrong!');
  }

  if (user?.verification?.verification) {
    throw forbidden('User already verified');
  }

  if (!payload?.code) {
    throw forbidden('Enter 6 digit code');
  }

  if (new Date() > (user?.verification?.expired as Date)) {
    throw forbidden('Expired . Please request a new code.');
  }

  if (!(payload?.code === user?.verification?.code)) {
    throw forbidden('Oops! That’s not the right code');
  }

  await User.findOneAndUpdate(
    { email: payload.email },
    { verification: { verification: true, code: payload?.code } },
  );

  return;
};

const verificationForgetPassword = async (payload: {
  code: string;
  email: string;
}) => {
  const user = await User.findOne({ email: payload.email }).select(
    'verification',
  );

  if (!user) {
    throw forbidden('Something went wrong!');
  }

  if (!payload?.code) {
    throw forbidden('Enter 6 digit code');
  }

  if (new Date() > (user?.verification?.expired as Date)) {
    throw forbidden('Expired . Please request a new code.');
  }

  if (!(payload?.code === user?.verification?.code)) {
    throw forbidden('Oops! That’s not the right code');
  }

  await User.findOneAndUpdate(
    { email: payload.email },
    { verification: { verification: true, code: payload?.code } },
  );

  const jwtPayload = {
    email: payload.email,
    code: payload.code,
  };

  const validation = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '2m' as string,
  );

  return { validation };
};

// Resend verification code
const verificationCodeReSend = async (payload: TUser & TProfile) => {
  const code = generateUniqueCode(6);
  const expired = new Date();
  expired.setMinutes(expired.getMinutes() + 2);

  const newUserInfo = {
    verification: { code, expired },
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
       color: #f1f1f1;
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
    <div class="code">${code}</div>
    <p>This code will expire shortly. Please use it as soon as possible.</p>
    <div class="footer">
      Need assistance? <a href="mailto:support@yourstore.com">support@yourstore.com</a><br>
      &copy; ${new Date().getFullYear()} YourStore
    </div>
  </div>
</body>
</html>`,
    subject: 'Verify OTP to Change Password',
  };

  const mainSended = await sendEmail(emailData);

  if (mainSended) {
    const updatedUser = await User.findOneAndUpdate(
      { email: payload?.email },
      newUserInfo,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      throw notFound('User update filled');
    }
    return;
  }
};
const setNewPassword = async (token: string, password: string) => {
  // Checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  // Checking if the user exists
  const user = (await User.findOne({ email }).select(
    'email status',
  )) as unknown as TUser;

  if (!user) {
    throw notFound('User not found!');
  }

  const userStatus = user?.status;

  if (userStatus === 'de-active') {
    throw forbidden('The user has been blocked!');
  }

  // Ensure bcrypt_salt_rounds is a valid number
  const saltRounds = Number(config.bcrypt_salt_rounds);

  if (isNaN(saltRounds) || saltRounds <= 0) {
    throw new Error('Invalid bcrypt salt rounds configuration.');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: hashedPassword,
      updateAt: new Date(),
    },
  );

  return '';
};

const changePassword = async (req: any) => {
  // const token = req.headers.authorization;
  const token = req.cookies.refreshToken;
  const payload = req.body;
  // const token = req.cookies.refreshToken;

  if (!token) {
    throw forbidden('Something went wrong');
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  // checking if the user is exist
  const user = await User.findOne({ email: decoded?.email }).select(
    '+password',
  );

  if (!user) {
    throw notFound('User not found!');
  }

  const userStatus = user?.status;
  if (userStatus === 'de-active') {
    throw forbidden('The user has been blocked!');
  }

  //hash new password
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const passwordMatch = await bcrypt.compare(
    payload.oldPassword,
    user?.password,
  );

  if (!passwordMatch) {
    throw forbidden('Please provide the correct information.');
  }

  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: hashedPassword,
      updateAt: new Date(),
    },
  );
};

export const AuthServices = {
  loginUser,
  logoutUser,
  changePassword,
  refreshToken,
  verification,
  forgerPassword,
  sendOPTPhone,
  setNewPassword,
  verificationForgetPassword,
  verificationCodeReSend,
};
