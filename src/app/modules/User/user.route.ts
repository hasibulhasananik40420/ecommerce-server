import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/sendImageToCloudinary';
import { USER_ROLE } from './user.constant';

const router = express.Router();


// Create a new user
router.post('/create-user', UserControllers.createUser);

// Get a single user
router.get('/user/:id', auth('admin', 'user'), UserControllers.getUser);

// Get a me 
router.get('/get-me', auth('admin', 'user'), UserControllers.getMe);

// Get all users
router.get('/users',  auth(USER_ROLE.admin), UserControllers.getUsers);

// Update an existing user
router.put(
  '/update-user',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  auth('admin', 'user'),
  UserControllers.updateUser,
);

// Delete a user
router.delete('/delete-user/:id', auth('admin'), UserControllers.deleteUser);

export const userRoutes = router;
