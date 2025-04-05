"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthControllers.loginUser);
router.post('/logout', auth_controller_1.AuthControllers.logoutUser);
router.post('/refresh-token', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.refreshTokenValidationSchema), auth_controller_1.AuthControllers.refreshToken);
router.post('/verification', 
// validateRequest(AuthValidation.verificationSchema),
auth_controller_1.AuthControllers.verification);
router.post('/forget-password', auth_controller_1.AuthControllers.forgerPassword);
/*
  strep 02  token and code send
 {
   "email": "<email>",
   "code": "12345"
 }
 
 
 return and set token in cookie
 
  */
router.put('/new-password-verification', auth_controller_1.AuthControllers.verificationForgetPassword);
/*
  strep 03  token and code send
 {
    "token": "",
    "password" : "new password"
}
*/
router.post('/set-new-password', auth_controller_1.AuthControllers.setNewPassword);
// ---------------- forget password end  ----------- \\
// Resend your verification code
// { "email" : "<email>"}
router.put('/resend-verification-code', auth_controller_1.AuthControllers.verificationCodeReSend);
/**
 * change password
 * {
 *  "newPassword": "12345678",
 *  "oldPassword": "omar121"
 * }
 
 *  */
router.put('/change-password', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user), auth_controller_1.AuthControllers.changePassword);
exports.AuthRoutes = router;
