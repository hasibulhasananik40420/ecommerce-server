import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post('/logout', AuthControllers.logoutUser);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/verification',
  // validateRequest(AuthValidation.verificationSchema),
  AuthControllers.verification,
);


router.post(
  '/forget-password',
  AuthControllers.forgerPassword,
);
/* 
  strep 02  token and code send 
 {
   "email": "<email>",
   "code": "12345"
 }
 
 
 return and set token in cookie 
 
  */

router.put(
  '/new-password-verification',
  AuthControllers.verificationForgetPassword,
);

/*
  strep 03  token and code send 
 {
    "token": "",
    "password" : "new password"
}
*/
router.post(
  '/set-new-password',
  AuthControllers.setNewPassword,
);
// ---------------- forget password end  ----------- \\


// Resend your verification code

// { "email" : "<email>"}

router.put('/resend-verification-code', AuthControllers.verificationCodeReSend);


/**
 * change password 
 * {
 *  "newPassword": "12345678",
 *  "oldPassword": "omar121"
 * }
 
 *  */ 
router.put(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  AuthControllers.changePassword,
);

export const AuthRoutes = router;
