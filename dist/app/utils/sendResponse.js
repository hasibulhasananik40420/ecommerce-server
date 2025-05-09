"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data,
        exportData: data.exportData,
    });
};
exports.default = sendResponse;
