import express, { Express } from "express";
//import multer from "multer";
//import { sanitizeValue } from "./sanitize";

//const fileMiddleware = multer({ storage: multer.memoryStorage() });
export const registerFormMiddleware = (app: Express) => {
    //extended se permiten datos mas complejos a ser procesados, se le da formato
    app.use(express.urlencoded({ extended: true }))
}
export const registerFormRoutes = (app: Express) => {
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
}