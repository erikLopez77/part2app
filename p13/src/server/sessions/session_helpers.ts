import { Request } from "express";
import session, { SessionData } from "express-session";
import sessionStore from "connect-session-sequelize";
import { Sequelize } from "sequelize";
import { Result } from "../data/repository";
//as any devuelve la p. de sesion almacenada en request
export const getSession = (req: Request): SessionData => (req as any).session;
//indica a Ts que la interfaz Req tiene prop.adicional
/* declare global {
    module Express {
        interface Request {
            session: Session
            // Esto ayuda a TypeScript a reconocer req.session en otras partes del código.
        }
    }
} */

declare module "express-session" {
    //representar los datos de sesión por parte del paquete.
    interface SessionData {
        //result tiene los datos que se están mandando
        personalHistory: Result[];
    }
}
export const sessionMiddleware = () => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "pkg_sessions.db"//instancia de sequelize para conectarse a SQlite
    });
    //sessionStores conector entre express-session y sequelize
    const store = new (sessionStore(session.Store))({
        db: sequelize
    });
    store.sync();//inicializa db
    //representar los datos de sesión por parte del paquete.
    //gestion de cada sesion de usuario de un servidor web
    return session({
        secret: "mysecret",
        store: store,//almacena las sesiones en db
        cookie: { maxAge: 300 * 1000, sameSite: "strict" },//tiempode vida de la cookie
        //resave no guarda la sesion si no hubo cambios 
        resave: false,
        //no guarda sesion vacía
        saveUninitialized: false
    })
}