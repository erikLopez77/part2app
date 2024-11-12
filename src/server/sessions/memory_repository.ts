import { Session, SessionRepository } from "./repository";
import { randomUUID } from "crypto";
type SessionWrapper = {
    session: Session,
    expires: Date
}
export class MemoryRepository implements SessionRepository {
    //mapa que usa el id de la sesión como clave y guarda un objeto que contiene la sesión y su fecha de expiración
    store = new Map<string, SessionWrapper>();
    async createSession(): Promise<Session> {
        //identificadores p/ cada sesión
        //id único con randomUUID, data es null
        return { id: randomUUID(), data: {} };
    }
    async getSession(id: string): Promise<Session | undefined> {
        //busca en la store una sesion con el id dado
        const wrapper = this.store.get(id);
        if (wrapper && wrapper.expires > new Date(Date.now())) {
            //creación de un nuevo objeto
            //structuredClone crea copia profunda del contenido
            return structuredClone(wrapper.session)
        }
    }
    async saveSession(session: Session, expires: Date): Promise<void> {
        //guarda o actualiza sesion con store configurando fecha de expiración
        this.store.set(session.id, { session, expires });
    }//actualiza la fecha de expiración de una sesión (extiende el tiempo de la sesion activa) 
    async touchSession(session: Session, expires: Date): Promise<void> {
        const wrapper = this.store.get(session.id);
        if (wrapper) {
            wrapper.expires = expires;
        }
    }
}