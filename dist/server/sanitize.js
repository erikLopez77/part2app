"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeValue = void 0;
const matchPattern = /[&<>="'`]/g;
const characterMappings = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "=": "&#x3D;", "'": "&#x27;", "`": "&#x60;" };
const sanitizeValue = (value) => value?.replace(matchPattern, match => characterMappings[match]);
exports.sanitizeValue = sanitizeValue;
