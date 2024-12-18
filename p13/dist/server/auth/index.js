"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleHook = exports.roleGuard = exports.createAuth = void 0;
const orm_authstore_1 = require("./orm_authstore");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const passport_config_1 = require("./passport_config");
const jwt_secret = "mytokensecret";
const store = new orm_authstore_1.OrmAuthStore();
//autenticación para la app
const createAuth = (app) => {
    (0, passport_config_1.configurePassport)({ store, jwt_secret });
    //autentica solicitudes, sesion es la fuente de datos de autenticacion
    app.use(passport_1.default.authenticate("session"), (req, resp, next) => {
        resp.locals.user = req.user;
        resp.locals.authenticated
            = req.authenticated = req.user !== undefined;
        next();
    });
    //plantilla inicio de sesion
    app.get("/signin", (req, resp) => {
        const data = {
            // username: req.query["username"],
            // password: req.query["password"],
            failed: req.query["failed"] ? true : false,
            signinpage: true //metodo de representación del formulario
        };
        resp.render("signin", data);
    }); //authenticate validará credenciales con estrategia local
    app.post("/signin", passport_1.default.authenticate("local", {
        failureRedirect: `/signin?failed=1`, //caso fallido
        successRedirect: "/" //caso de éxito
    })); //valida credenciales por el cliente 
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
    app.get("/unauthorized", async (req, resp) => {
        resp.render("unauthorized");
    });
}; //acepta rol y devuelve un componente middleware que pasará soli al controlador
exports.createAuth = createAuth;
//si el usuario está asignado a ese rol (validateMembership)
const roleGuard = (role) => {
    return async (req, resp, next) => {
        if (req.authenticated) {
            const username = req.user?.username;
            if (username != undefined
                && await store.validateMembership(username, role)) {
                next();
                return;
            } //p/ soli autenticadas
            resp.redirect("/unauthorized");
        }
        else { //en caso de no haber sido autenticado
            resp.redirect("/signin");
        }
    };
};
exports.roleGuard = roleGuard;
//creamos un gancho  para autorizar acceso a ciertos roles
const roleHook = (role) => {
    //se accede a la identidad de usuario por HookContext
    return async (ctx) => {
        if (!ctx.params.authenticated) {
            //solicitud sin autenticación
            ctx.http = { status: 401 };
            ctx.result = {};
        }
        else if (!(await store.validateMembership(ctx.params.user.username, role))) {
            //usuario autenticado pero no autorizado
            ctx.http = { status: 403 };
            ctx.result = {};
        }
    };
};
exports.roleHook = roleHook;
