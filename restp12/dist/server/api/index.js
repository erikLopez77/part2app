"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApi = void 0;
//import repository from "../data";
const http_adapter_1 = require("./http_adapter");
const results_api_1 = require("./results_api");
const createApi = (app) => {
    (0, http_adapter_1.createAdapter)(app, new results_api_1.ResultWebService(), "/api/results");
};
exports.createApi = createApi;
