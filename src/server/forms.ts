import { Express } from "express";
export const registerFormMiddleware = (app: Express) => {
    // no middleware yet
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
        req.pipe(resp);
    });
}