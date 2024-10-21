"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFormRoutes = exports.registerFormMiddleware = void 0;
const express_1 = __importDefault(require("express"));
//import multer from "multer";
//import { sanitizeValue } from "./sanitize";
//const fileMiddleware = multer({ storage: multer.memoryStorage() });
const registerFormMiddleware = (app) => {
    //extended se permiten datos mas complejos a ser procesados, se le da formato
    app.use(express_1.default.urlencoded({ extended: true }));
};
exports.registerFormMiddleware = registerFormMiddleware;
const registerFormRoutes = (app) => {
    app.get("/form", (req, resp) => {
        resp.render("age");
    });
    app.post("/form", (req, resp) => {
        //renderiza a plantilla formData
        resp.render("age", {
            ...req.body,
            nextage: Number.parseInt(req.body.age) + 1
        });
    });
};
exports.registerFormRoutes = registerFormRoutes;
