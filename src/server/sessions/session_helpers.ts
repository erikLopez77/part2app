import { Request } from "express";
import { Session } from "./repository"; //as any devuelve la p. de sesion
export const getSession = (req: Request): Session => (req as any).session;
//indica a Ts que la interfaz Req tiene prop.adicional
declare global {
    module Express {
        interface Request {
            session: Session
            // Esto ayuda a TypeScript a reconocer req.session en otras partes del código.
        }
    }
}