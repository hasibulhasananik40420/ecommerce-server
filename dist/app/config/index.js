"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt_refresh_expires_in = exports.jwt_access_expires_in = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join((process.cwd(), '.env')) });
exports.default = {
    node_env: process.env.NODE_ENV,
    node_env_pro: process.env.NODE_ENV_PRO,
    mongo_prod: process.env.MONGO_PROD,
    port: process.env.PORT,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
    super_admin_email: process.env.SUPER_ADMIN_EMAIL,
    wel_come_message: process.env.WELCOME_MESSAGE,
    mongo_uri_dev: process.env.MONGO_URI_DEV,
    mongo_uri_prod: process.env.MONGO_URI_PROD,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    client_url: process.env.CLIENT_URL,
    server_url: process.env.SERVER_URL,
    // smtp
    smtp_port: process.env.SMTP_PORT,
    smtp_host: process.env.SMTP_HOST,
    smtp_mail: process.env.SMTP_MAIL,
    smtp_password: process.env.SMTP_PASSWORD,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
    sslStorePass: process.env.SSL_STORE_PASS,
    sslStoreId: process.env.SSL_STORE_ID,
    pbAppId: process.env.FB_APP_ID,
    pbPageId: process.env.FB_PAGE_ID,
    pbAppSecret: process.env.FB_APP_SECRET,
    pbAccessToken: process.env.FB_ACCESS_TOKEN,
};
exports.jwt_access_expires_in = '31536000s';
exports.jwt_refresh_expires_in = '31536000s';
