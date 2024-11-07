import express, { Express } from "express";
import repository from "./data";
import { getJsonCookie, setJsonCookie } from "./cookies";
const rowLimit = 10;

export const registerFormMiddleware = (app: Express) => {
    //extended se permiten datos mas complejos a ser procesados, se le da formato
    app.use(express.urlencoded({ extended: true }))
}
export const registerFormRoutes = (app: Express) => {
    app.get("/form", async (req, resp) => {
        resp.render("age", {
            history: await repository.getAllResults(rowLimit),
            personalHistory: getJsonCookie(req, "personalHistory")
        });
    });

    app.post("/form",
        async (req, resp) => {
            const nextage = Number.parseInt(req.body.age)
                + Number.parseInt(req.body.years);
            await repository.saveResult({ ...req.body, nextage });
            let pHistory = [{
                name: req.body.name, age: req.body.age,
                years: req.body.years, nextage
            },
            ...(getJsonCookie(req, "personalHistory") || [])].splice(0, 5);
            setJsonCookie(resp, "personalHistory", pHistory);
            //cada sesion extiende la sesion de un usuario
            //si no se hace sol. antes de que caduque, el navegador la descarta y no la incluirá
            const context = {
                ...req.body, nextage
                //los res se pasan a plantilla por
                , history: await repository.getAllResults(rowLimit),
                personalHistory: pHistory
            };
            resp.render("age", context);
        });
}
