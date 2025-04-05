"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
exports.contactsServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const contact_model_1 = require("./contact.model");
// Create a new user
const createContacts = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contact_model_1.Contacts.create(Object.assign({}, payload));
    return result;
});
const getContacts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (req === null || req === void 0 ? void 0 : req.query) || {};
    const queryBuilder = new QueryBuilder_1.default(contact_model_1.Contacts.find(), query);
    queryBuilder.search([]).filter().dateFilter('createdAt').sort().paginate();
    const exported = new QueryBuilder_1.default(contact_model_1.Contacts.find(), query);
    exported.search([]).filter().dateFilter('createdAt').sort().paginate();
    const result = yield queryBuilder.modelQuery;
    const exportData = yield exported.modelQuery;
    const meta = yield queryBuilder.countTotal();
    return { result, meta, exportData };
});
exports.contactsServices = {
    createContacts,
    getContacts,
};
