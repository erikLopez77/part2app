"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFormRoutes = exports.registerFormMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const registerFormMiddleware = (app) => {
    //extended se permiten datos mas complejos aser procesados
    app.use(express_1.default.urlencoded({ extended: true }));
};
exports.registerFormMiddleware = registerFormMiddleware;
const registerFormRoutes = (app) => {
    app.get("/form", (req, resp) => {
        for (const key in req.query) {
            resp.write(`${key}: ${req.query[key]}\n`);
        }
        resp.end();
    });
    app.post("/form", (req, resp) => {
        resp.write(`Content-Type: ${req.headers["content-type"]}\n`);
        if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
            req.pipe(resp);
        }
        else {
            for (const key in req.body) {
                resp.write(`${key}:${req.body[key]}\n`);
            }
            resp.end();
        }
    });
};
exports.registerFormRoutes = registerFormRoutes;
