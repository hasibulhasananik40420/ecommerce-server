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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const errorfunc_1 = require("../utils/errorfunc");
const user_model_1 = require("../modules/User/user.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // checking if the token is missing
        if (!token) {
            throw (0, errorfunc_1.unauthorized)('Please log in!');
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
        }
        catch (error) {
            res.status(401).json({
                message: 'Unauthorized: Invalid or expired token',
            });
            return;
        }
        const { email, role } = decoded;
        // Find the full user information by email
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            throw (0, errorfunc_1.notFound)('User not found!');
        }
        // Check user status
        if (user.status === 'de-active') {
            throw (0, errorfunc_1.forbidden)('The user has been blocked!');
        }
        if (user.status !== 'active') {
            throw (0, errorfunc_1.forbidden)('The user has been blocked!');
        }
        // Check if the user's role is authorized
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw (0, errorfunc_1.unauthorized)('You are not authorized!');
        }
        // Attach full user information to the request object
        req.user = Object.assign(Object.assign({}, decoded), { role, email });
        next();
    }));
};
exports.default = auth;
