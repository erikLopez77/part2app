import { Op, Sequelize } from "sequelize";
import { Session, SessionRepository } from "./repository";
import { SessionModel, initializeModel } from "./orm_models";
import { randomUUID } from "crypto";
export class OrmRepository implements SessionRepository {
    sequelize: Sequelize;
    constructor() {
        this.sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "orm_sessions.db",
            logging: console.log,
            logQueryParameters: true
        });
        this.initModelAndDatabase();
    }
    async initModelAndDatabase(): Promise<void> {
        initializeModel(this.sequelize);
        await this.sequelize.drop();
        await this.sequelize.sync();
    }
    async createSession(): Promise<Session> {
        return { id: randomUUID(), data: {} };
    }//consulta la base de datos para encontrar una fila con una llave principal
    //determinada y una fecha de vencimiento futura,
    async getSession(id: string): Promise<Session | undefined> {
        const dbsession = await SessionModel.findOne({
            //Op.gt representa una comparación mayor
            where: { id, expires: { [Op.gt]: new Date(Date.now()) } }
        });
        if (dbsession) {
            return { id, data: dbsession.data };
        }
    }
    async saveSession(session: Session, expires: Date): Promise<void> {
        //upsert actualiza si existe sino se inserta
        await SessionModel.upsert({
            id: session.id,
            data: session.data,
            expires
        });
    }
    async touchSession(session: Session, expires: Date): Promise<void> {
        await SessionModel.update({ expires }, { where: { id: session.id } });
    }
}