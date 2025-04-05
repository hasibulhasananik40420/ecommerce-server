"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const contact_controller_1 = require("./contact.controller");
const router = express_1.default.Router();
router.post('/send', contact_controller_1.contactsControllers.createContacts);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), contact_controller_1.contactsControllers.getContacts);
exports.messageRoutes = router;
