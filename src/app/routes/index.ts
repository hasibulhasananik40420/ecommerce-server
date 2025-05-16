import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { notificationRoutes } from '../modules/Notifications/notification.route';
import { userRoutes } from '../modules/User/user.route';
import { categoryRoutes } from '../modules/Category/category.route';
import { productRoutes } from '../modules/Product/product.routes';
import { reviewRoutes } from '../modules/Review/review.routes';
import { shippingAddressRoutes } from '../modules/ShipingAddress/shiping.address.route';

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
    path: '/review',
    route: reviewRoutes,
  },
  {
    path: '/notification',
    route: notificationRoutes,
  },
  {
    path: '/shippng-address',
    route: shippingAddressRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
