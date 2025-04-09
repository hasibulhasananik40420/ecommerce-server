"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
// Create a new user
router.post('/create-user', user_controller_1.UserControllers.createUser);
// Get a single user
router.get('/user/:id', (0, auth_1.default)('admin', 'customar'), user_controller_1.UserControllers.getUser);
// Get a me 
router.get('/get-me', (0, auth_1.default)('admin', 'customar'), user_controller_1.UserControllers.getMe);
// Get all users
router.get('/users', user_controller_1.UserControllers.getUsers);
// Update an existing user
router.put('/update-profile', sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, auth_1.default)('admin', 'customar'), user_controller_1.UserControllers.updateProfile);
// Delete a user
router.delete('/delete-user/:id', (0, auth_1.default)('admin'), user_controller_1.UserControllers.deleteUser);
exports.userRoutes = router;
