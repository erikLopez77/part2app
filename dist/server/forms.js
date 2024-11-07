"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFormRoutes = exports.registerFormMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const data_1 = __importDefault(require("./data"));
const cookies_1 = require("./cookies");
const rowLimit = 10;
const registerFormMiddleware = (app) => {
    //extended se permiten datos mas complejos a ser procesados, se le da formato
    app.use(express_1.default.urlencoded({ extended: true }));
};
exports.registerFormMiddleware = registerFormMiddleware;
const registerFormRoutes = (app) => {
    app.get("/form", async (req, resp) => {
        resp.render("age", {
            history: await data_1.default.getAllResults(rowLimit),
            personalHistory: (0, cookies_1.getJsonCookie)(req, "personalHistory")
        });
    });
    app.post("/form", async (req, resp) => {
        const nextage = Number.parseInt(req.body.age)
            + Number.parseInt(req.body.years);
        await data_1.default.saveResult({ ...req.body, nextage });
        let pHistory = [{
                name: req.body.name, age: req.body.age,
                years: req.body.years, nextage
            },
            ...((0, cookies_1.getJsonCookie)(req, "personalHistory") || [])].splice(0, 5);
        (0, cookies_1.setJsonCookie)(resp, "personalHistory", pHistory);
        //cada sesion extiende la sesion de un usuario
        //si no se hace sol. antes de que caduque, el navegador la descarta y no la incluirá
        const context = {
            ...req.body, nextage
            //los res se pasan a plantilla por
            ,
            history: await data_1.default.getAllResults(rowLimit),
            personalHistory: pHistory
        };
        resp.render("age", context);
    });
};
exports.registerFormRoutes = registerFormRoutes;
