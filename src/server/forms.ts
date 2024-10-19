import express, { Express } from "express";
export const registerFormMiddleware = (app: Express) => {
    //extended se permiten datos mas complejos aser procesados
    app.use(express.urlencoded({ extended: true }))
}
export const registerFormRoutes = (app: Express) => {
    app.get("/form", (req, resp) => {
        for (const key in req.query) {
            resp.write(`${key}: ${req.query[key]}\n`);
        }
        resp.end();
    });

    app.post("/form", (req, resp) => {
        resp.write(`Content-Type: ${req.headers["content-type"]}\n`)
        if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
            req.pipe(resp);
        } else {
            for (const key in req.body) {
                resp.write(`${key}:${req.body[key]}\n`);
            }
            resp.end();
        }
    });
}