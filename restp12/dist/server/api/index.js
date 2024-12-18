"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApi = void 0;
const results_api_1 = require("./results_api");
const validation_adapters_1 = require("./validation_adapters");
const results_api_validation_1 = require("./results_api_validation");
const feathers_adapters_1 = require("./feathers_adapters");
const feathers_1 = require("@feathersjs/feathers");
const express_1 = __importStar(require("@feathersjs/express"));
const validation_types_1 = require("./validation_types");
const createApi = (app) => {
    //createAdapter(app, new Validator(new ResultWebService(),
    // ResultWebServiceValidation), "/api/results");
    const feathersApp = (0, express_1.default)((0, feathers_1.feathers)(), app).configure((0, express_1.rest)());
    const service = new validation_adapters_1.Validator(new results_api_1.ResultWebService(), results_api_validation_1.ResultWebServiceValidation);
    feathersApp.use('/api/results', new feathers_adapters_1.FeathersWrapper(service));
    feathersApp.hooks({
        error: {
            all: [(ctx) => {
                    if (ctx.error instanceof validation_types_1.ValidationError) {
                        ctx.http = { status: 400 };
                        ctx.error = undefined;
                    }
                }]
        }
    });
};
exports.createApi = createApi;
