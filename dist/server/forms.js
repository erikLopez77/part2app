"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFormRoutes = exports.registerFormMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const validation_1 = require("./validation");
//const fileMiddleware = multer({ storage: multer.memoryStorage() });
const registerFormMiddleware = (app) => {
    //extended se permiten datos mas complejos a ser procesados, se le da formato
    app.use(express_1.default.urlencoded({ extended: true }));
};
exports.registerFormMiddleware = registerFormMiddleware;
const registerFormRoutes = (app) => {
    app.get("/form", (req, resp) => {
        resp.render("age", { helpers: { pass } });
    });
    app.post("/form", (0, validation_1.validate)("name").required().minLength(5), (0, validation_1.validate)("age").isInteger(), (req, resp) => {
        const validation = (0, validation_1.getValidationResults)(req);
        const context = {
            ...req.body, validation,
            helpers: { pass }
        };
        if (validation.valid) {
            context.nextage = Number.parseInt(req.body.age) + 1;
        }
        resp.render("age", context);
    });
};
exports.registerFormRoutes = registerFormRoutes;
//valid,propname,test- validation,age,isInteger
const pass = (valid, propname, test) => {
    //verifica si hay resultados de validacion para la edad
    let propResult = valid?.results?.[propname];
    //si la edad es verdadera el dsiplay es none(invisible), sino block(visible)
    return `display:${!propResult || propResult[test] ? "none" : "block"}`;
};
