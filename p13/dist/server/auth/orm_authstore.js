"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrmAuthStore = void 0;
const sequelize_1 = require("sequelize");
const orm_auth_models_1 = require("./orm_auth_models");
const crypto_1 = require("crypto");
class OrmAuthStore {
    sequelize;
    constructor() {
        this.sequelize = new sequelize_1.Sequelize({
            dialect: "sqlite",
            storage: "orm_auth.db", //db
            logging: console.log,
            logQueryParameters: true
        });
        this.initModelAndDatabase();
    }
    async initModelAndDatabase() {
        (0, orm_auth_models_1.initializeAuthModels)(this.sequelize);
        await this.sequelize.drop();
        await this.sequelize.sync();
        await this.storeOrUpdateUser("alice", "mysecret");
        await this.storeOrUpdateUser("bob", "mysecret");
    }
    async getUser(name) {
        return await orm_auth_models_1.CredentialsModel.findByPk(name);
    }
    async storeOrUpdateUser(username, password) {
        const salt = (0, crypto_1.randomBytes)(16);
        const hashedPassword = await this.createHashCode(password, salt);
        const [model] = await orm_auth_models_1.CredentialsModel.upsert({
            username, hashedPassword, salt
        });
        return model;
    }
    async validateCredentials(username, password) {
        const storedCreds = await this.getUser(username);
        if (storedCreds) {
            const candidateHash = //calcula  nuevo codigo hash con contraseña candidata
             await this.createHashCode(password, storedCreds.salt);
            //compara hash de forma segura
            return (0, crypto_1.timingSafeEqual)(candidateHash, storedCreds.hashedPassword);
        }
        return false;
    } //crea un codigo hash usando pbkdf
    createHashCode(password, salt) {
        return new Promise((resolve, reject) => {
            //contraseña a codificar, salt, iteraciones,logitud, algoritmo
            (0, crypto_1.pbkdf2)(password, salt, 100000, 64, "sha512", (err, hash) => {
                if (err) {
                    reject(err);
                }
                ;
                resolve(hash);
            });
        });
    }
}
exports.OrmAuthStore = OrmAuthStore;
