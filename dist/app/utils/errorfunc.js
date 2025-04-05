"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conflict = exports.serverError = exports.forbidden = exports.notFound = exports.unauthorized = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const unauthorized = (message) => {
    return new AppError_1.default(401, message, [{ path: 'unauthorize', message }]);
};
exports.unauthorized = unauthorized;
const notFound = (message) => {
    return new AppError_1.default(404, message, [{ path: 'not_found', message }]);
};
exports.notFound = notFound;
const conflict = (message) => {
    return new AppError_1.default(409, message, [{ path: 'conflict', message }]);
};
exports.conflict = conflict;
const serverError = (message) => {
    return new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, message, [{ path: 'server_error', message }]);
};
exports.serverError = serverError;
const forbidden = (message) => {
    return new AppError_1.default(403, message, [{ path: 'forbidden', message }]);
};
exports.forbidden = forbidden;
