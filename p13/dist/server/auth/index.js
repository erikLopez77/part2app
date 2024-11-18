"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuth = void 0;
const orm_authstore_1 = require("./orm_authstore");
const store = new orm_authstore_1.OrmAuthStore();
//autenticación para la app
const createAuth = (app) => {
    //plantilla inicio de sesion
    app.get("/signin", (req, resp) => {
        const data = {
            username: req.query["username"],
            password: req.query["password"],
            failed: req.query["failed"] ? true : false,
        };
        resp.render("signin", data);
    }); //validar credenciales
    app.post("/signin", async (req, resp) => {
        const username = req.body.username;
        const password = req.body.password;
        const valid = await store.validateCredentials(username, password);
        if (valid) {
            resp.redirect("/");
        }
        else { //cargar el navegador sin inicio de sesion
            resp.redirect(`/signin?username=${username}&password=${password}&failed=1`);
        }
    });
};
exports.createAuth = createAuth;
