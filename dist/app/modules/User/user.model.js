"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Profile = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    profileId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Profiles',
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['customar', 'admin'],
        default: 'customar',
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'de-active'],
        default: 'active',
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 8,
        trim: true,
    },
    verification: {
        code: { type: String },
        expired: { type: Date },
        verification: { type: Boolean },
    },
    rememberPassword: {
        type: Boolean,
        default: false,
        trim: true,
    },
}, {
    timestamps: true,
});
const profileSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    image: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});
exports.Profile = (0, mongoose_1.model)('Profiles', profileSchema);
exports.User = (0, mongoose_1.model)('Users', userSchema);
