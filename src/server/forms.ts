import express, { Express } from "express";
import multer from "multer";
import { sanitizeValue } from "./sanitize";

const fileMiddleware = multer({ storage: multer.memoryStorage() });
export const registerFormMiddleware = (app: Express) => {
    //extended se permiten datos mas complejos a ser procesados, se le da formato
    app.use(express.urlencoded({ extended: true }))
}
export const registerFormRoutes = (app: Express) => {
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
}