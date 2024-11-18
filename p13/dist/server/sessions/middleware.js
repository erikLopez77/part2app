"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customSessionMiddleware = void 0;
//import { MemoryRepository } from "./memory_repository";
const cookies_1 = require("../cookies");
const orm_repository_1 = require("./orm_repository");
const session_cookie_name = "custom_session";
const expiry_seconds = 300;
const getExpiryDate = () => new Date(Date.now() + (expiry_seconds * 1_000));
const customSessionMiddleware = () => {
    //repo almacena sesiones en memoria
    const repo = new orm_repository_1.OrmRepository();
    return async (req, resp, next) => {
        const id = (0, cookies_1.getCookie)(req, session_cookie_name);
        //se inicia nueva sesion sino hay cookie o no se encuentra session con ID
        const session = (id ? await repo.getSession(id) : undefined)
            ?? await repo.createSession();
        //se agrega la sesion a la soli
        req.session = session;
        (0, cookies_1.setCookie)(resp, session_cookie_name, session.id, {
            maxAge: expiry_seconds * 1000
        });
        //se activa finish c/ respuesta completada
        //once controla el evento y almacena la sesión.
        resp.once("finish", async () => {
            if (Object.keys(session.data).length > 0) {
                //se almacenan sesiones http post
                if (req.method == "POST") {
                    await repo.saveSession(session, getExpiryDate());
                }
                else {
                    //para otro métodos HTTP, para extender el tiempo de expiración de la sesión, 
                    //pero los datos de la sesión no se almacenan.
                    await repo.touchSession(session, getExpiryDate());
                }
            }
        });
        next();
    };
};
exports.customSessionMiddleware = customSessionMiddleware;
