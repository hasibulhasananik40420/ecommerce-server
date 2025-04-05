"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidYouTubeEmbedUrl = void 0;
const isValidYouTubeEmbedUrl = (url) => {
    const embedRegex = /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+(\?.*)?$/;
    return embedRegex.test(url);
};
exports.isValidYouTubeEmbedUrl = isValidYouTubeEmbedUrl;
