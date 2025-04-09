"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const user_model_1 = require("./user.model");
const errorfunc_1 = require("../../utils/errorfunc");
const mongoose_1 = require("mongoose");
const generateUniqueCode_1 = require("../../utils/generateUniqueCode");
const hashedPassword_1 = require("../../utils/hashedPassword");
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
// Get a single user
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id).populate("profileId");
    if (!user) {
        throw (0, errorfunc_1.notFound)("No user found.");
    }
    return user;
});
const getMe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id)
        .populate("profileId")
        .select("-verification");
    if (!user) {
        throw (0, errorfunc_1.notFound)("No user found.");
    }
    // Destructure and reassemble the user data
    const _a = user.toObject(), { profileId, email } = _a, restUserData = __rest(_a, ["profileId", "email"]);
    return Object.assign(Object.assign(Object.assign({}, profileId), { email }), restUserData);
});
const getUsers = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (req === null || req === void 0 ? void 0 : req.query) || {};
    const queryBuilder = new QueryBuilder_1.default(user_model_1.User.find({ role: "customar" }), query);
    queryBuilder
        .search([])
        .filter()
        .dateFilter("createdAt")
        .populate("profileId")
        .sort()
        .paginate();
    const result = yield queryBuilder.modelQuery;
    const meta = yield queryBuilder.countTotal();
    return { result, meta };
});
// Create a new user
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const isExitsUser = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
        if (isExitsUser) {
            throw (0, errorfunc_1.notFound)("User already exists.");
        }
        const password = yield (0, hashedPassword_1.hashedPassword)(payload === null || payload === void 0 ? void 0 : payload.password);
        const code = (0, generateUniqueCode_1.generateUniqueCode)(6);
        const newProfile = {
            name: payload === null || payload === void 0 ? void 0 : payload.name,
            phone: payload === null || payload === void 0 ? void 0 : payload.phone,
            email: payload === null || payload === void 0 ? void 0 : payload.email,
            image: (payload === null || payload === void 0 ? void 0 : payload.image) || "",
        };
        // Profile creation within the transaction
        const userProfile = yield user_model_1.Profile.create([newProfile], { session });
        const expired = new Date();
        expired.setMinutes(expired.getMinutes() + 2);
        const newUserInfo = {
            profileId: (_a = userProfile[0]) === null || _a === void 0 ? void 0 : _a._id,
            email: payload.email,
            role: "customar",
            password,
            rememberPassword: false,
            status: "active",
            verification: { code, verification: false, expired },
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
</html>

`,
            subject: "Verify OTP",
        };
        const mainSended = yield (0, sendEmail_1.default)(emailData);
        if (mainSended) {
            yield user_model_1.User.create([newUserInfo], { session });
            yield session.commitTransaction();
        }
        else {
            throw new Error("Failed to send email.");
        }
    }
    catch (error) {
        // Rollback the transaction on error
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
// Update an existing user
const updateProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.id;
    const payload = req === null || req === void 0 ? void 0 : req.body;
    const file = req === null || req === void 0 ? void 0 : req.file;
    const isUser = (yield user_model_1.User.findById(id).select("+password"));
    if (!isUser) {
        throw (0, errorfunc_1.notFound)("No user found");
    }
    let profile = isUser.image;
    if (file) {
        try {
            const result = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(file.filename, file.path);
            profile = result.url;
        }
        catch (error) {
            throw (0, errorfunc_1.serverError)("Failed to upload the image.");
        }
    }
    payload.image = profile;
    yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    const updatedUser = yield user_model_1.Profile.findOneAndUpdate({ email: isUser === null || isUser === void 0 ? void 0 : isUser.email }, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedUser) {
        throw (0, errorfunc_1.forbidden)("User update filled");
    }
    return updatedUser;
});
// Delete a user
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = yield user_model_1.User.findByIdAndDelete(id);
    if (!deletedUser) {
        throw (0, errorfunc_1.notFound)("No user found.");
    }
    return deletedUser;
});
exports.UserServices = {
    getUser,
    getMe,
    getUsers,
    createUser,
    updateProfile,
    deleteUser,
};
