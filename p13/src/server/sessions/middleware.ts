import { Request, Response, NextFunction } from "express";
import { SessionRepository, Session } from "./repository";
//import { MemoryRepository } from "./memory_repository";
import { setCookie, getCookie } from "../cookies";
import { OrmRepository } from "./orm_repository";
const session_cookie_name = "custom_session";
const expiry_seconds = 300;
const getExpiryDate = () => new Date(Date.now() + (expiry_seconds * 1_000));
export const customSessionMiddleware = () => {
    //repo almacena sesiones en memoria
    const repo: SessionRepository = new OrmRepository();
    return async (req: Request, resp: Response, next: NextFunction) => {
        const id = getCookie(req, session_cookie_name);
        //se inicia nueva sesion sino hay cookie o no se encuentra session con ID
        const session = (id ? await repo.getSession(id) : undefined)
            ?? await repo.createSession();
        //se agrega la sesion a la soli
        (req as any).session = session;
        setCookie(resp, session_cookie_name, session.id, {
            maxAge: expiry_seconds * 1000
        })
        //se activa finish c/ respuesta completada
        //once controla el evento y almacena la sesión.
        resp.once("finish", async () => {
            if (Object.keys(session.data).length > 0) {
                //se almacenan sesiones http post
                if (req.method == "POST") {
                    await repo.saveSession(session, getExpiryDate());
                } else {
                    //para otro métodos HTTP, para extender el tiempo de expiración de la sesión, 
                    //pero los datos de la sesión no se almacenan.
                    await repo.touchSession(session, getExpiryDate());
                }
            }
        })
        next();
    }
}
