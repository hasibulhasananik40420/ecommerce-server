"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importStar(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_utils_1 = require("./auth.utils");
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const twilio_1 = require("twilio");
const errorfunc_1 = require("../../utils/errorfunc");
const user_model_1 = require("../User/user.model");
const generateUniqueCode_1 = require("../../utils/generateUniqueCode");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw (0, errorfunc_1.notFound)('User not found!');
    }
    if (!((_a = user === null || user === void 0 ? void 0 : user.verification) === null || _a === void 0 ? void 0 : _a.verification)) {
        throw (0, errorfunc_1.notFound)('You are not verified!');
    }
    // checking if the user is already deleted
    const isPasswordMatched = yield bcrypt_1.default.compare(payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw (0, errorfunc_1.forbidden)('Please provide the correct password.');
    }
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'de-active') {
        throw (0, errorfunc_1.forbidden)('The account has been blocked.');
    }
    if ((user === null || user === void 0 ? void 0 : user.status) !== 'active') {
        throw (0, errorfunc_1.forbidden)('Please provide the correct password.');
    }
    const isProfile = yield user_model_1.Profile.findOne({ email: user === null || user === void 0 ? void 0 : user.email });
    if (isProfile === null) {
        throw (0, errorfunc_1.forbidden)('Something was wrong.');
    }
    yield user.save();
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        firstName: isProfile === null || isProfile === void 0 ? void 0 : isProfile.name,
        phone: isProfile === null || isProfile === void 0 ? void 0 : isProfile.phone,
        id: user === null || user === void 0 ? void 0 : user._id,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const logoutUser = (req, data) => __awaiter(void 0, void 0, void 0, function* () {
    // const token = req.cookies.refreshToken;
    // const token = req.headers.authorization;
    const token = req.cookies.refreshToken;
    if (!token) {
        throw (0, errorfunc_1.notFound)('Something was wrong');
    }
    yield user_model_1.User.updateOne({ email: data === null || data === void 0 ? void 0 : data.email }, { $pull: { devices: { deviceId: data === null || data === void 0 ? void 0 : data.deviceId } } });
    req.headers.authorization = '';
    req.cookies.refreshToken = '';
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const decoded = (0, auth_utils_1.verifyToken)(refreshToken, config_1.default.jwt_refresh_secret);
    const { email, deviceId } = decoded;
    const user = (yield user_model_1.User.findOne({ email }));
    if (!user) {
        throw (0, errorfunc_1.notFound)('User not found!');
    }
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'de-active') {
        throw (0, errorfunc_1.forbidden)('Please provide the correct password.');
    }
    if (user.status !== 'active') {
        throw (0, errorfunc_1.forbidden)('Please provide the correct password.');
    }
    const isDevice = yield user_model_1.User.findOne({
        email: decoded === null || decoded === void 0 ? void 0 : decoded.email,
        'devices.deviceId': deviceId,
    });
    if (isDevice === null || !isDevice) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Session is expire new error!', [
            {
                path: 'unauthorized',
                message: 'Session is expire new error!',
            },
        ]);
    }
    res.clearCookie('connect.sid');
    yield user_model_1.User.updateOne({ email: user === null || user === void 0 ? void 0 : user.email, 'devices.deviceId': deviceId }, {
        $set: {
            'devices.$.lastActivity': new Date(),
        },
    });
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const forgerPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw (0, errorfunc_1.notFound)('User not found!');
    }
    const verification = (_a = user === null || user === void 0 ? void 0 : user.verification) === null || _a === void 0 ? void 0 : _a.verification;
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'de-active') {
        throw (0, errorfunc_1.forbidden)('This use was blocked.');
    }
    const code = (0, generateUniqueCode_1.generateUniqueCode)(6);
    const body = `This is your verification code ${code}`;
    const emailData = {
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
    const sentMail = yield (0, sendEmail_1.default)(emailData);
    const expired = new Date();
    expired.setMinutes(expired.getMinutes() + 2);
    // const sentMail = true;
    if (sentMail) {
        yield user_model_1.User.findOneAndUpdate({ email }, { verification: { code, verification, expired } });
    }
    return body;
});
const sendOPTPhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ phonePrimary: phone });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'de-active') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    const verificationCode = Math.floor(10000 + Math.random() * 900000).toString();
    const accountSid = config_1.default.twilioAccountSid;
    const authToken = config_1.default.twilioAuthToken;
    const twilioPhoneNumber = '+8801762844222';
    const client = new twilio_1.Twilio(accountSid, authToken);
    const generateOTP = () => {
        // Generate a random 6-digit OTP
        return Math.floor(10000 + Math.random() * 900000).toString();
    };
    const otp = generateOTP();
    const message = yield client.messages.create({
        body: 'You have an appointment with Owl, Inc. on Friday, November 3 at 4:00 PM. Reply C to confirm.',
        from: twilioPhoneNumber,
        to: phone,
    });
    // const now = new Date();
    const futureTime = new Date().getTime() + 5 * 60000;
    const sentOTP = true;
    if (sentOTP) {
        yield user_model_1.User.findOneAndUpdate({ phoneOne: phone }, { verification: { code: verificationCode, time: futureTime } });
    }
    return `${message} your opt ${otp}`;
});
const verification = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log(payload);
    const user = yield user_model_1.User.findOne({ email: payload.email }).select('verification');
    if (!user) {
        throw (0, errorfunc_1.forbidden)('Something went wrong!');
    }
    if ((_a = user === null || user === void 0 ? void 0 : user.verification) === null || _a === void 0 ? void 0 : _a.verification) {
        throw (0, errorfunc_1.forbidden)('User already verified');
    }
    if (!(payload === null || payload === void 0 ? void 0 : payload.code)) {
        throw (0, errorfunc_1.forbidden)('Enter 6 digit code');
    }
    if (new Date() > ((_b = user === null || user === void 0 ? void 0 : user.verification) === null || _b === void 0 ? void 0 : _b.expired)) {
        throw (0, errorfunc_1.forbidden)('Expired . Please request a new code.');
    }
    if (!((payload === null || payload === void 0 ? void 0 : payload.code) === ((_c = user === null || user === void 0 ? void 0 : user.verification) === null || _c === void 0 ? void 0 : _c.code))) {
        throw (0, errorfunc_1.forbidden)('Oops! That’s not the right code');
    }
    yield user_model_1.User.findOneAndUpdate({ email: payload.email }, { verification: { verification: true, code: payload === null || payload === void 0 ? void 0 : payload.code } });
    return;
});
const verificationForgetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield user_model_1.User.findOne({ email: payload.email }).select('verification');
    if (!user) {
        throw (0, errorfunc_1.forbidden)('Something went wrong!');
    }
    if (!(payload === null || payload === void 0 ? void 0 : payload.code)) {
        throw (0, errorfunc_1.forbidden)('Enter 6 digit code');
    }
    if (new Date() > ((_a = user === null || user === void 0 ? void 0 : user.verification) === null || _a === void 0 ? void 0 : _a.expired)) {
        throw (0, errorfunc_1.forbidden)('Expired . Please request a new code.');
    }
    if (!((payload === null || payload === void 0 ? void 0 : payload.code) === ((_b = user === null || user === void 0 ? void 0 : user.verification) === null || _b === void 0 ? void 0 : _b.code))) {
        throw (0, errorfunc_1.forbidden)('Oops! That’s not the right code');
    }
    yield user_model_1.User.findOneAndUpdate({ email: payload.email }, { verification: { verification: true, code: payload === null || payload === void 0 ? void 0 : payload.code } });
    const jwtPayload = {
        email: payload.email,
        code: payload.code,
    };
    const validation = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '2m');
    return { validation };
});
// Resend verification code
const verificationCodeReSend = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const code = (0, generateUniqueCode_1.generateUniqueCode)(6);
    const expired = new Date();
    expired.setMinutes(expired.getMinutes() + 2);
    const newUserInfo = {
        verification: { code, expired },
    };
    const emailData = {
        email: payload === null || payload === void 0 ? void 0 : payload.email,
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
    const mainSended = yield (0, sendEmail_1.default)(emailData);
    if (mainSended) {
        const updatedUser = yield user_model_1.User.findOneAndUpdate({ email: payload === null || payload === void 0 ? void 0 : payload.email }, newUserInfo, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            throw (0, errorfunc_1.notFound)('User update filled');
        }
        return;
    }
});
const setNewPassword = (token, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    // Checking if the user exists
    const user = (yield user_model_1.User.findOne({ email }).select('email status -_id'));
    if (!user) {
        throw (0, errorfunc_1.notFound)('User not found!');
    }
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'de-active') {
        throw (0, errorfunc_1.forbidden)('The user has been blocked!');
    }
    // Ensure bcrypt_salt_rounds is a valid number
    const saltRounds = Number(config_1.default.bcrypt_salt_rounds);
    if (isNaN(saltRounds) || saltRounds <= 0) {
        throw new Error('Invalid bcrypt salt rounds configuration.');
    }
    // Hash new password
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
    yield user_model_1.User.findOneAndUpdate({
        email: decoded.email,
    }, {
        password: hashedPassword,
        updateAt: new Date(),
    });
    return '';
});
const changePassword = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // const token = req.headers.authorization;
    const token = req.cookies.refreshToken;
    const payload = req.body;
    // const token = req.cookies.refreshToken;
    if (!token) {
        throw (0, errorfunc_1.forbidden)('Something went wrong');
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: decoded === null || decoded === void 0 ? void 0 : decoded.email }).select('+password');
    if (!user) {
        throw (0, errorfunc_1.notFound)('User not found!');
    }
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'de-active') {
        throw (0, errorfunc_1.forbidden)('The user has been blocked!');
    }
    //hash new password
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const passwordMatch = yield bcrypt_1.default.compare(payload.oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!passwordMatch) {
        throw (0, errorfunc_1.forbidden)('Please provide the correct information.');
    }
    yield user_model_1.User.findOneAndUpdate({
        email: decoded.email,
    }, {
        password: hashedPassword,
        updateAt: new Date(),
    });
});
exports.AuthServices = {
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
