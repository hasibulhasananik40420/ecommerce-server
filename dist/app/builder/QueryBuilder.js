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
const moment_timezone_1 = __importDefault(require("moment-timezone"));
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        var _a;
        const searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        if (this.query.today === 'today') {
            const dateField = 'updatedAt';
            const startOfDay = new Date();
            const endOfDay = new Date();
            startOfDay.setUTCHours(0, 0, 0, 0);
            endOfDay.setUTCHours(23, 59, 59, 999);
            const filterCondition = {
                [dateField]: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            };
            if (this.modelQuery) {
                this.modelQuery = this.modelQuery.find(filterCondition);
            }
            delete this.query.today;
        }
        else {
            delete this.query.today;
        }
        const queryObj = Object.fromEntries(Object.entries(this.query).map(([key, value]) => [
            key.trim(),
            value === 'null' || value === '' ? null : value,
        ]));
        if (typeof queryObj.orderStatus === 'string') {
            queryObj.orderStatus = queryObj.orderStatus
                .split(',')
                .map((status) => status.trim());
        }
        // Exclude fields
        const excludeFields = [
            'searchTerm',
            'sort',
            'limit',
            'page',
            'fields',
            'categories',
            'startDate',
            'endDate',
            'fromDate',
            'toDate',
        ];
        excludeFields.forEach((el) => delete queryObj[el]);
        for (const key in queryObj) {
            if (queryObj[key] === null) {
                delete queryObj[key];
            }
        }
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    todyOrder(dateField) {
        if (!dateField) {
            return this;
        }
        const orderDate = this.query.todyOrder;
        if (!orderDate) {
            return this;
        }
        const isValidDate = (date) => date && !isNaN(Date.parse(date));
        const validFromDate = isValidDate(orderDate);
        if (validFromDate) {
            const filterCondition = {
                [dateField]: {},
            };
            if (validFromDate) {
                const startOfDay = new Date();
                const endOfDay = new Date();
                startOfDay.setUTCHours(0, 0, 0, 0);
                endOfDay.setUTCHours(23, 59, 59, 999);
                filterCondition[dateField].$gte = startOfDay;
                filterCondition[dateField].$lte = endOfDay;
            }
            this.modelQuery = this.modelQuery.find(filterCondition);
        }
        return this;
    }
    dateFilterOne(dateField) {
        if (!dateField) {
            return this;
        }
        const orderDate = this.query.fromDate;
        const isValidDate = (date) => date && !isNaN(Date.parse(date));
        const validFromDate = isValidDate(orderDate);
        if (validFromDate) {
            const filterCondition = {
                [dateField]: {},
            };
            if (validFromDate) {
                const startOfDay = new Date(orderDate);
                const endOfDay = new Date(orderDate);
                startOfDay.setUTCHours(0, 0, 0, 0);
                endOfDay.setUTCHours(23, 59, 59, 999);
                filterCondition[dateField].$gte = startOfDay;
                filterCondition[dateField].$lte = endOfDay;
            }
            this.modelQuery = this.modelQuery.find(filterCondition);
        }
        return this;
    }
    dateFilterTow(dateField) {
        if (!dateField) {
            return this;
        }
        const devilryDate = this.query.toDate;
        const isValidDate = (date) => date && !isNaN(Date.parse(date));
        const validToDate = isValidDate(devilryDate);
        if (validToDate) {
            const filterCondition = {
                [dateField]: {},
            };
            if (validToDate) {
                const startOfDay = moment_timezone_1.default
                    .tz(devilryDate, 'Asia/Dhaka')
                    .startOf('day')
                    .toDate();
                const endOfDay = moment_timezone_1.default
                    .tz(devilryDate, 'Asia/Dhaka')
                    .endOf('day')
                    .toDate();
                filterCondition[dateField].$gte = startOfDay;
                filterCondition[dateField].$lte = endOfDay;
            }
            this.modelQuery = this.modelQuery.find(filterCondition);
        }
        return this;
    }
    dateFilter(dateField) {
        if (!dateField) {
            return this;
        }
        const fromDate = this.query.startDate;
        const toDate = this.query.endDate;
        const isValidDate = (date) => date && !isNaN(Date.parse(date));
        const validFromDate = isValidDate(fromDate);
        const validToDate = isValidDate(toDate);
        if (!validFromDate || !validToDate) {
            return this;
        }
        const filterCondition = {
            [dateField]: {},
        };
        const startOfDay = new Date(fromDate);
        startOfDay.setUTCHours(18, 0, 0, 0);
        filterCondition[dateField].$gte = startOfDay;
        const endOfDay = new Date(toDate);
        endOfDay.setUTCHours(17, 59, 59, 999);
        filterCondition[dateField].$lte = endOfDay;
        this.modelQuery = this.modelQuery.find(filterCondition);
        return this;
    }
    sort() {
        var _a, _b, _c;
        const sort = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 20;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    populate(path, select) {
        this.modelQuery = this.modelQuery.populate(path, select);
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            const filteredQuery = this.modelQuery.model.find(this.modelQuery.getFilter());
            const total = yield filteredQuery.countDocuments();
            // Check if no documents found after filtering
            if (total === 0) {
                return {
                    page: Number(this.query.page) || 1,
                    limit: Number(this.query.limit) || 20,
                    total: 0,
                    totalPage: 0,
                };
            }
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 20;
            const totalPage = Math.ceil(total / limit);
            return {
                page,
                limit,
                total,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
