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
exports.databaseConnecting = databaseConnecting;
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = __importDefault(require("."));
const DB_1 = __importDefault(require("./DB"));
function databaseConnecting() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (_1.default.mongo_prod) {
                yield mongoose_1.default.connect(`${_1.default.mongo_uri_prod}`, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    serverSelectionTimeoutMS: 1000,
                });
                (0, DB_1.default)();
                console.log('Database      :🚀 Connected to database (Production)');
            }
            else {
                yield mongoose_1.default.connect(_1.default.mongo_uri_dev);
                (0, DB_1.default)();
                console.log('Database      :🚀 Connected to database (Development)');
            }
        }
        catch (error) {
            console.error('Database      :🙄 Error connecting to the database');
        }
    });
}
