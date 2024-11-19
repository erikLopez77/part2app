import express, { Express } from "express";
import repository from "./data";
import cookieMiddleware from "cookie-parser";
import { sessionMiddleware } from "./sessions/session_helpers";
import { roleGuard } from "./auth";
import { Result } from "./data/repository";

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
        resp.render("data", {
            data: await repository.getAllResults(rowLimit)
        });
    });
    //restringido a admins
    app.post("/form/delete/:id", roleGuard("Admins"), async (req, resp) => {
        const id = Number.parseInt(req.params["id"]);
        await repository.delete(id);
        resp.redirect("/form");
        resp.end();
    });//restringido a usuarios
    app.post("/form/add", roleGuard("Users"), async (req, resp) => {
        const nextage = Number.parseInt(req.body["age"])
            + Number.parseInt(req.body["years"]);
        await repository.saveResult({ ...req.body, nextage } as Result);
        resp.redirect("/form");
        resp.end();
    });

}
