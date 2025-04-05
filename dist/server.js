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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = __importDefault(require("http"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const database_config_1 = require("./app/config/database.config");
// import {
//   paymentCancel,
//   paymentFailed,
//   paymentSuccess,
//   validationPayment,
// } from './app/modules/payment/payment.service';
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("./app/config"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
// const checkOrigin = async (origin: any) => {
//   if (config.node_env === 'development') {
//     if (!origin) return true;
//   }
//   return await permittedOrigins().then((origins) => {
//     return origins.includes(origin);
//   });
// };
const corsOptions = {
    origin: (origin, callback) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            callback(null, true);
            // const allowed = await checkOrigin(origin);
            // if (allowed) {
            //   callback(null, true);
            // } else {
            //   callback(new Error('Not allowed by CORS'));
            // }
        }
        catch (error) {
            callback(error);
        }
    }),
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'superAuth',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};
app.use((0, express_session_1.default)({
    secret: config_1.default.jwt_access_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
}));
app.use((0, cors_1.default)(corsOptions));
app.set('trust proxy', true);
app.use((0, cookie_parser_1.default)());
(0, database_config_1.databaseConnecting)();
const startServer = (req, res) => {
    try {
        res.send(`${config_1.default.wel_come_message}`);
    }
    catch (error) {
        console.log('server not start');
    }
};
app.get('/', startServer);
app.get('/api/v1/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let url;
    try {
        url = `https://graph.facebook.com/v22.0/${config_1.default.pbPageId}/ratings?fields=reviewer,rating,review_text,created_time&access_token=${config_1.default.pbAccessToken}`;
        console.log(url);
        const response = yield axios_1.default.get(url);
        if (response.data && response.data.data) {
            res.status(200).json({
                success: true,
                reviews: response.data.data,
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: 'No reviews found for this page.',
            });
        }
    }
    catch (error) {
        console.error('Error fetching reviews:', error === null || error === void 0 ? void 0 : error.message);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching reviews.',
        });
    }
    return url;
}));
// app.post('/api/payment-confirmation/:id', paymentSuccess);
// app.post('/ipn_listener', validationPayment);
// app.post('/api/payment-failed', paymentFailed);
// app.post('/api/payment-cancel', paymentCancel);
app.use('/api/v1', routes_1.default);
app.use(notFound_1.default);
app.use(globalErrorhandler_1.default);
server.listen(config_1.default.port, () => {
    console.log(`Local         :👉 http://localhost:${config_1.default.port}/`);
});
