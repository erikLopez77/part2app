"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partial = exports.style = void 0;
const fs_1 = require("fs");
const style = (stylesheet) => {
    return `<link href="/css/${stylesheet}" rel="stylesheet"/>`;
};
exports.style = style;
const partial = (file, context) => {
    const path = `./${context.settings.views}/${file}.custom`;
    return (0, fs_1.readFileSync)(path, "utf-8");
};
exports.partial = partial;
