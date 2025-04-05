"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPasswordMatched = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const isPasswordMatched = (oldPassword, hashPassword) => {
    bcrypt_1.default.compare(oldPassword, hashPassword);
};
exports.isPasswordMatched = isPasswordMatched;
