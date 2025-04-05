import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { notificationRoutes } from '../modules/Notifications/notification.route';
import { userRoutes } from '../modules/User/user.route';
import { categoryRoutes } from '../modules/Category/category.route';
import { productRoutes } from '../modules/Product/product.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/category',
    route: categoryRoutes,
  },
 
  
  {
    path: '/product',
    route: productRoutes,
  },
  
  {
    path: '/notification',
    route: notificationRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
