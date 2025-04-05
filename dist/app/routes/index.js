"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/Auth/auth.route");
const notification_route_1 = require("../modules/Notifications/notification.route");
const user_route_1 = require("../modules/User/user.route");
const category_route_1 = require("../modules/Category/category.route");
const product_routes_1 = require("../modules/Product/product.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/user',
        route: user_route_1.userRoutes,
    },
    {
        path: '/category',
        route: category_route_1.categoryRoutes,
    },
    {
        path: '/product',
        route: product_routes_1.productRoutes,
    },
    {
        path: '/notification',
        route: notification_route_1.notificationRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
