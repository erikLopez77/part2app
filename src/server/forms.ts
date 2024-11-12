import express, { Express } from "express";
import repository from "./data";
import cookieMiddleware from "cookie-parser";
import { customSessionMiddleware } from "./sessions/middleware";
import { getSession, sessionMiddleware } from "./sessions/session_helpers";
const rowLimit = 10;

export const registerFormMiddleware = (app: Express) => {
    //extended se permiten datos mas complejos a ser procesados, se le da formato
    app.use(express.urlencoded({ extended: true }));
    //middeware p/ analizar cookies en solic.se configura clave secreta
    app.use(cookieMiddleware("mysecret"));
    //middleware p/manejar sesiones, crea, actualiza
    // app.use(customSessionMiddleware());
    app.use(sessionMiddleware());
}
export const registerFormRoutes = (app: Express) => {
    app.get("/form", async (req, resp) => {
        resp.render("age", {
            history: await repository.getAllResults(rowLimit),
            //getSession accede de forma consistente a sesion de una soli.
            personalHistory: getSession(req).personalHistory
        });
    });

    app.post("/form",
        async (req, resp) => {
            const nextage = Number.parseInt(req.body.age)
                + Number.parseInt(req.body.years);
            await repository.saveResult({ ...req.body, nextage });
            req.session.personalHistory = [{
                id: 0, name: req.body.name, age: req.body.age,
                years: req.body.years, nextage
            },
            ...(req.session.personalHistory || [])].splice(0, 5);
            //cada sesion extiende la sesion de un usuario
            //si no se hace sol. antes de que caduque, el navegador la descarta y no la incluirá
            const context = {
                ...req.body, nextage
                //los res se pasan a plantilla por
                , history: await repository.getAllResults(rowLimit),
                personalHistory: req.session.personalHistory
            };
            resp.render("age", context);
        });
}
