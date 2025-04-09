import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import catchAsync from '../utils/catchAsync';
import { forbidden, notFound, unauthorized } from '../utils/errorfunc';
import { User } from '../modules/User/user.model';
import { TUserRole } from '../modules/User/user.interface';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.headers.authorization;
      

    // checking if the token is missing
    if (!token) {
      throw unauthorized('Please log in!');
    }


    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (error) {
      res.status(401).json({
        message: 'Unauthorized: Invalid or expired token',
      });
      return;
    }

    const { email, role } = decoded;


    // Find the full user information by email
    const user = await User.findOne({ email });


    if (!user) {
      throw notFound('User not found!');
    }


    // Check user status
    if (user.status === 'de-active') {
      throw forbidden('The user has been blocked!');
    }

    if (user.status !== 'active') {
      throw forbidden('The user has been blocked!');
    } 

    // Check if the user's role is authorized
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw unauthorized('You are not authorized!');
    }

    

    // Attach full user information to the request object
    req.user = { ...decoded, role, email};

    next();
  });
};

export default auth;
