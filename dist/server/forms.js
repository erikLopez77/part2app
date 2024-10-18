"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFormRoutes = exports.registerFormMiddleware = void 0;
const registerFormMiddleware = (app) => {
    // no middleware yet
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
        req.pipe(resp);
    });
};
exports.registerFormRoutes = registerFormRoutes;
