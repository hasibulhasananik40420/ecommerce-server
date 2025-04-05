"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contacts = void 0;
const mongoose_1 = require("mongoose");
const contactSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'Enter your first name'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Enter your last name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Enter your email'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Enter your phone'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Enter message'],
    },
    termsAccepted: {
        type: Boolean,
        required: [true, 'Accepted terms and condition'],
        trim: true,
    },
}, {
    timestamps: true,
});
exports.Contacts = (0, mongoose_1.model)('contacts', contactSchema);
