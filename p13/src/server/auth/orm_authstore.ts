import { Sequelize } from "sequelize";
import { CredentialsModel, initializeAuthModels }
    from "./orm_auth_models";
import { AuthStore } from "./auth_types";
import { pbkdf2, randomBytes, timingSafeEqual } from "crypto";
export class OrmAuthStore implements AuthStore {
    sequelize: Sequelize;
    constructor() {
        this.sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "orm_auth.db",//db
            logging: console.log,
            logQueryParameters: true
        });
        this.initModelAndDatabase();
    }
    async initModelAndDatabase(): Promise<void> {
        initializeAuthModels(this.sequelize);
        await this.sequelize.drop();
        await this.sequelize.sync();
        await this.storeOrUpdateUser("alice", "mysecret");
        await this.storeOrUpdateUser("bob", "mysecret");
    }
    async getUser(name: string) {//recupera credenciales
        return await CredentialsModel.findByPk(name);
    }
    async storeOrUpdateUser(username: string, password: string) {
        const salt = randomBytes(16);
        const hashedPassword = await this.createHashCode(password, salt);
        const [model] = await CredentialsModel.upsert({
            username, hashedPassword, salt
        });
        return model;
    }
    async validateCredentials(username: string, password: string):
        Promise<boolean> {
        const storedCreds = await this.getUser(username);
        if (storedCreds) {
            const candidateHash =//calcula  nuevo codigo hash con contraseña candidata
                await this.createHashCode(password, storedCreds.salt);
            //compara hash de forma segura
            return timingSafeEqual(candidateHash, storedCreds.hashedPassword);
        }
        return false;
    }//crea un codigo hash usando pbkdf
    private createHashCode(password: string, salt: Buffer): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            //contraseña a codificar, salt, iteraciones,logitud, algoritmo
            pbkdf2(password, salt, 100000, 64, "sha512", (err, hash) => {
                if (err) {
                    reject(err)
                };
                resolve(hash);
            })
        })
    }
}