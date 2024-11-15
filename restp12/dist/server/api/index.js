"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApi = void 0;
//import repository from "../data";
const http_adapter_1 = require("./http_adapter");
const results_api_1 = require("./results_api");
const validation_adapters_1 = require("./validation_adapters");
const results_api_validation_1 = require("./results_api_validation");
const createApi = (app) => {
    (0, http_adapter_1.createAdapter)(app, new validation_adapters_1.Validator(new results_api_1.ResultWebService(), results_api_validation_1.ResultWebServiceValidation), "/api/results");
};
exports.createApi = createApi;
