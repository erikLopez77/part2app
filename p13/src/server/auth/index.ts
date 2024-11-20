import { Express, NextFunction, RequestHandler } from "express";
import { AuthStore } from "./auth_types";
import { OrmAuthStore } from "./orm_authstore";
import jwt from "jsonwebtoken";
import { HookContext } from "@feathersjs/feathers";
import passport from "passport";
import { configurePassport } from "./passport_config";

const jwt_secret = "mytokensecret";
const store: AuthStore = new OrmAuthStore();
//type User = { username: string }
//propiedad de nombre
declare module "express-session" {
    interface SessionData { username: string; }
}//propiedades de usuario
declare global {
    module Express {
        // interface Request { user: User, authenticated: boolean }
        interface Request { feathers?: any, authenticated: boolean }
        interface User {
            username: string
        }
    }
}
//autenticación para la app
export const createAuth = (app: Express) => {
    configurePassport({ store, jwt_secret });
    //autentica solicitudes, sesion es la fuente de datos de autenticacion
    app.use(passport.authenticate("session"), (req, resp, next) => {
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
            signinpage: true//metodo de representación del formulario
        }
        resp.render("signin", data);
    });//authenticate validará credenciales con estrategia local
    app.post("/signin", passport.authenticate("local", {
        failureRedirect: `/signin?failed=1`,//caso fallido
        successRedirect: "/"//caso de éxito
    }));//valida credenciales por el cliente 
    app.post("/api/signin", async (req, resp) => {
        const username = req.body.username;
        const password = req.body.password;
        const result: any = {
            success: await store.validateCredentials(username, password)
        }//si es valido se crea un token
        if (result.success) {//usuario, la firma, objeto p/ expiracion
            result.token = jwt.sign({ username }, jwt_secret,
                { expiresIn: "1hr" });
        }//se envían los resultados
        resp.json(result);
        resp.end();
    });
    //usuario cierra la sesion y destruye dicho objeto
    app.post("/signout", async (req, resp) => {
        req.session.destroy(() => {
            resp.redirect("/");
        })
    });
    app.get("/unauthorized", async (req, resp) => {
        resp.render("unauthorized");
    });
}//acepta rol y devuelve un componente middleware que pasará soli al controlador
//si el usuario está asignado a ese rol (validateMembership)
export const roleGuard = (role: string)
    : RequestHandler<Request, Response, NextFunction> => {
    return async (req, resp, next) => {
        if (req.authenticated) {
            const username = req.user?.username;
            if (username != undefined
                && await store.validateMembership(username, role)) {
                next();
                return;
            }//p/ soli autenticadas
            resp.redirect("/unauthorized");
        } else {//en caso de no haber sido autenticado
            resp.redirect("/signin");
        }
    }
}
//creamos un gancho  para autorizar acceso a ciertos roles
export const roleHook = (role: string) => {
    //se accede a la identidad de usuario por HookContext
    return async (ctx: HookContext) => {
        if (!ctx.params.authenticated) {
            //solicitud sin autenticación
            ctx.http = { status: 401 };
            ctx.result = {};
        } else if (!(await store.validateMembership(
            ctx.params.user.username, role))) {
            //usuario autenticado pero no autorizado
            ctx.http = { status: 403 };
            ctx.result = {};
        }
    }
}
