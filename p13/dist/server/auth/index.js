"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuth = void 0;
const orm_authstore_1 = require("./orm_authstore");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_secret = "mytokensecret";
const store = new orm_authstore_1.OrmAuthStore();
//autenticación para la app
const createAuth = (app) => {
    app.use((req, resp, next) => {
        const username = req.session.username;
        if (username) {
            req.authenticated = true;
            req.user = { username };
        }
        else if (req.headers.authorization) {
            let token = req.headers.authorization;
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, jwt_secret);
                req.authenticated = true;
                req.user = { username: decoded.username };
            }
            catch {
                // do nothing - cannot verify token
            }
        }
        else {
            req.authenticated = false;
        } //crean datos locales
        resp.locals.user = req.user;
        resp.locals.authenticated = req.authenticated;
        next();
    });
    //plantilla inicio de sesion
    app.get("/signin", (req, resp) => {
        const data = {
            username: req.query["username"],
            password: req.query["password"],
            failed: req.query["failed"] ? true : false,
            signinpage: true //metodo de representación del formulario
        };
        resp.render("signin", data);
    }); //validar credenciales
    app.post("/signin", async (req, resp) => {
        const username = req.body.username;
        const password = req.body.password;
        const valid = await store.validateCredentials(username, password);
        if (valid) { //se guarda el nombre en la sesion activa
            req.session.username = username;
            resp.redirect("/"); //pagina principaal
        }
        else { //cargar el navegador sin inicio de sesion
            resp.redirect(`/signin?username=${username}&password=${password}&failed=1`);
        }
    }); //valida credenciales por el cliente 
    app.post("/api/signin", async (req, resp) => {
        const username = req.body.username;
        const password = req.body.password;
        const result = {
            success: await store.validateCredentials(username, password)
        }; //si es valido se crea un token
        if (result.success) { //usuario, la firma, objeto p/ expiracion
            result.token = jsonwebtoken_1.default.sign({ username }, jwt_secret, { expiresIn: "1hr" });
        } //se envían los resultados
        resp.json(result);
        resp.end();
    });
    //usuario cierra la sesion y destruye dicho objeto
    app.post("/signout", async (req, resp) => {
        req.session.destroy(() => {
            resp.redirect("/");
        });
    });
};
exports.createAuth = createAuth;
