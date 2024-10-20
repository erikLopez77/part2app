import express, { Express } from "express";
import multer from "multer";

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
        resp.write(`Content-Type: ${req.headers["content-type"]}\n`)
        for (const key in req.body) {
            resp.write(`${key}:${req.body[key]}\n`);
        }
        if (req.file) {
            resp.write(`---\nFile:${req.file.originalname}\n`);
            resp.write(req.file.buffer.toString());
        }
        resp.end();

    });
}