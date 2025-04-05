"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const decoded = ({ token, res }) => {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (error) {
        res.status(401).json({
            message: 'Unauthorized: Invalid or expired token',
        });
    }
    return decoded;
};
exports.default = decoded;
