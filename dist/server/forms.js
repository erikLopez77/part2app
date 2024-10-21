"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFormRoutes = exports.registerFormMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fileMiddleware = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const registerFormMiddleware = (app) => {
    //extended se permiten datos mas complejos a ser procesados, se le da formato
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
    app.post("/form", fileMiddleware.single("datafile"), (req, resp) => {
        //renderiza a plantilla formData
        resp.render("formData", {
            ...req.body, file: req.file,
            fileData: req.file?.buffer.toString()
        });
    });
};
exports.registerFormRoutes = registerFormRoutes;
