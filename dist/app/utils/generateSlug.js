"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = void 0;
/* eslint-disable no-useless-escape */
const generateSlug = (title) => {
    return title
        .trim()
        .toLowerCase()
        .replace(/[:,.\/\\'"]/g, '')
        .replace(/\s+/g, '-');
};
exports.generateSlug = generateSlug;
