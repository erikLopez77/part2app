"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidationResults = exports.validate = void 0;
const validate = (propName) => {
    const tests = {};
    const handler = (req, resp, next) => {
        const vreq = req;
        if (!vreq.validation) {
            vreq.validation = { results: {}, valid: true };
        }
        vreq.validation.results[propName] = { valid: true };
        Object.keys(tests).forEach(k => {
            let valid = vreq.validation.results[propName][k]
                = tests[k](req.body?.[propName]);
            if (!valid) {
                vreq.validation.results[propName].valid = false;
                vreq.validation.valid = false;
            }
        });
        next();
    };
    handler.required = () => {
        tests.required = (val) => val?.trim().length > 0;
        return handler;
    };
    handler.minLength = (min) => {
        tests.minLength = (val) => val?.trim().length >= min;
        return handler;
    };
    handler.isInteger = () => {
        tests.isInteger = (val) => /^[0-9]+$/.test(val);
        return handler;
    };
    return handler;
};
exports.validate = validate;
const getValidationResults = (req) => {
    return req.validation || { valid: true };
};
exports.getValidationResults = getValidationResults;
