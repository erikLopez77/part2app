import express, { Express } from "express";
import { getValidationResults, validate } from "./validation";

//const fileMiddleware = multer({ storage: multer.memoryStorage() });
export const registerFormMiddleware = (app: Express) => {
    //extended se permiten datos mas complejos a ser procesados, se le da formato
    app.use(express.urlencoded({ extended: true }))
}
export const registerFormRoutes = (app: Express) => {
    app.get("/form", (req, resp) => {
        resp.render("age", { helpers: { pass } });
    });

    app.post("/form",
        validate("name").required().minLength(5),
        validate("age").isInteger(),
        (req, resp) => {
            const validation = getValidationResults(req);
            const context = {
                ...req.body, validation,
                helpers: { pass }
            };
            if (validation.valid) {
                context.nextage = Number.parseInt(req.body.age) + 1;
            }
            resp.render("age", context);
        });
}
//valid,propname,test- validation,age,isInteger
const pass = (valid: any, propname: string, test: string) => {
    //verifica si hay resultados de validacion para la edad
    let propResult = valid?.results?.[propname];
    //si la edad es verdadera el dsiplay es none(invisible), sino block(visible)
    return `display:${!propResult || propResult[test] ? "none" : "block"}`;
}