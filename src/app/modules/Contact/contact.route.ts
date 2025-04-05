import express from 'express';

import auth from '../../middlewares/auth';

import { USER_ROLE } from '../User/user.constant';
import { contactsControllers } from './contact.controller';

const router = express.Router();


router.post('/send', contactsControllers.createContacts);


router.get('/',  auth(USER_ROLE.admin), contactsControllers.getContacts);


export const messageRoutes = router;
