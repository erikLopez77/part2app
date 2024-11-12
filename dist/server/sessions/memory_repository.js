"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryRepository = void 0;
const crypto_1 = require("crypto");
class MemoryRepository {
    //mapa que usa el id de la sesión como clave y guarda un objeto que contiene la sesión y su fecha de expiración
    store = new Map();
    async createSession() {
        //identificadores p/ cada sesión
        //id único con randomUUID, data es null
        return { id: (0, crypto_1.randomUUID)(), data: {} };
    }
    async getSession(id) {
        //busca en la store una sesion con el id dado
        const wrapper = this.store.get(id);
        if (wrapper && wrapper.expires > new Date(Date.now())) {
            //creación de un nuevo objeto
            //structuredClone crea copia profunda del contenido
            return structuredClone(wrapper.session);
        }
    }
    async saveSession(session, expires) {
        //guarda o actualiza sesion con store configurando fecha de expiración
        this.store.set(session.id, { session, expires });
    } //actualiza la fecha de expiración de una sesión (extiende el tiempo de la sesion activa) 
    async touchSession(session, expires) {
        const wrapper = this.store.get(session.id);
        if (wrapper) {
            wrapper.expires = expires;
        }
    }
}
exports.MemoryRepository = MemoryRepository;
