"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadHtmlFile = exports.sendPdfFileToCloudinary = exports.sendFileToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret,
    secure: true,
});
const sendFileToCloudinary = (fileName, path) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(path, { public_id: fileName.trim(), resource_type: 'raw', secure: true, format: 'html' }, // Use 'raw' for non-image files
        function (error, result) {
            if (error) {
                reject(error);
            }
            resolve(result);
            // delete a file asynchronously
            fs_1.default.unlink(path, () => { });
        });
    });
};
exports.sendFileToCloudinary = sendFileToCloudinary;
const sendPdfFileToCloudinary = (fileName, path) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(path, { public_id: fileName.trim(), resource_type: 'raw', secure: true, format: 'pdf' }, // Use 'raw' for non-image files
        function (error, result) {
            if (error) {
                reject(error);
            }
            resolve(result);
            // delete a file asynchronously
            fs_1.default.unlink(path, () => { });
        });
    });
};
exports.sendPdfFileToCloudinary = sendPdfFileToCloudinary;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        if ((file === null || file === void 0 ? void 0 : file.mimetype) === 'text/html') {
            cb(null, file.fieldname + '-' + uniqueSuffix + '.html');
        }
        else {
            cb(null, file.fieldname + '-' + uniqueSuffix);
        }
    },
});
exports.uploadHtmlFile = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            'text/html',
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        }
        else {
            cb(null, false);
        }
    },
});
