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
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const errorfunc_1 = require("./errorfunc");
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.smtp_host,
    port: 465,
    secure: true,
    auth: {
        user: config_1.default.smtp_mail,
        pass: config_1.default.smtp_password,
    },
});
const sendEmail = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: `"Omar Faruk" <${config_1.default.smtp_mail}>`,
            to: emailData.email,
            subject: emailData.subject,
            html: emailData.body,
        };
        if (!mailOptions.to) {
            throw (0, errorfunc_1.forbidden)('No recipient email address defined');
        }
        yield transporter.sendMail(mailOptions);
        return { success: true };
    }
    catch (error) {
        throw (0, errorfunc_1.forbidden)('Failed to send the email.');
    }
});
exports.default = sendEmail;
