import express, { Express } from "express";
import repository from "./data";
const rowLimit = 10;

export const registerFormMiddleware = (app: Express) => {
    //extended se permiten datos mas complejos a ser procesados, se le da formato
    app.use(express.urlencoded({ extended: true }))
}
export const registerFormRoutes = (app: Express) => {
    app.get("/form", async (req, resp) => {
        resp.render("age", {
            history: await repository.getAllResults(rowLimit)
        });
    });

    app.post("/form",
        async (req, resp) => {
            const nextage = Number.parseInt(req.body.age)
                + Number.parseInt(req.body.years);
            await repository.saveResult({ ...req.body, nextage });
            const context = {
                ...req.body, nextage
                //los res se pasan a plantilla por
                , history: await repository.getResultsByName(
                    req.body.name, rowLimit)
            };
            resp.render("age", context);
        });
}
