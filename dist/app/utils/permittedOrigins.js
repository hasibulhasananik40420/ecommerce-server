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
Object.defineProperty(exports, "__esModule", { value: true });
const errorfunc_1 = require("./errorfunc");
const permittedOrigins = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const origins = [
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:4173',
            'http://localhost:5000',
            'http://localhost:4174',
            'https://sandbox.sslcommerz.com',
            'https://securepay.sslcommerz.com',
            'https://www.sslcommerz.com',
            'http://res.cloudinary.com',
            'https://res.cloudinary.com',
            'https://api.cloudinary.com',
        ];
        return origins;
    }
    catch (error) {
        throw (0, errorfunc_1.unauthorized)('You are not authorized user');
    }
});
exports.default = permittedOrigins;
