"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const emailData = {
    email: config_1.default.smtp_mail,
    body: `
      <h2>Hello Sir</h2>
      <p>Please contact a developer. something pase issue</p>
      
    `,
    subject: 'Create user before validation',
};
const globalErrorHandler = (err, req, res, next) => {
    //setting default values
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorSources = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'ValidationError') {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'CastError') {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorSources = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
        errorSources = err.errorSources;
    }
    else if (err instanceof Error) {
        if (err.message.includes('buffering timed out')) {
            (0, sendEmail_1.default)(emailData);
            statusCode = 503; // Service Unavailable
            message = 'Please check your network and try again later.';
            errorSources = [
                {
                    path: 'server',
                    message: 'Please check your network and try again later.',
                },
            ];
        }
        else {
            message = err.message;
            errorSources = [
                {
                    path: '',
                    message: err === null || err === void 0 ? void 0 : err.message,
                },
            ];
        }
    }
    //ultimate return
    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: config_1.default.node_env === 'development' ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.default = globalErrorHandler;
